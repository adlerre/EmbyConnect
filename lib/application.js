var utils = require(__dirname + "/utils");
var DNSProxy = require(__dirname + "/dnsproxy");
var WebServer = require(__dirname + "/webserver");
var EmbyClient = require(__dirname + "/embyclient");
var logger = new (require(__dirname + "/logger"))("Main");
var atvLogger = new (require(__dirname + "/logger"))("ATVLogger");

var Application = function (params) {
    this._params = params;
    this._servers = [];
};

Application.prototype.getServerById = function (serverId) {
    for ( var i in this._servers) {
        var srv = this._servers[i];
        if (srv.Id === serverId) {
            return srv;
        }
    }

    return null;
};

Application.prototype.getClient = function (serverId) {
    var that = this;

    return new Promise(function (resolve, reject) {
        var srv = that.getServerById(serverId);
        if (!srv) {
            reject(new Error("No Server found with Id " + serverId + "."));
            return;
        }

        if (srv.client) {
            resolve(srv.client);
        } else {
            srv.client = new EmbyClient(srv.Address, srv.UserName || that._params.user, srv.Password || that._params.pass);
            srv.client.login().then(function (authInfo) {
                srv.Id = authInfo.ServerId;
                resolve(srv.client);
            }, reject);
        }
    });
};

Application.prototype.initRouting = function () {
    var that = this;
    var express = this._webServer.express();

    express.get("/logger", function (req, res) {
        switch (req.query.level) {
            case "error":
                atvLogger.error(req.query.msg);
                break;
            case "warn":
                atvLogger.warn(req.query.msg);
                break;
            case "debug":
                atvLogger.debug(req.query.msg);
                break;
            default:
                atvLogger.info(req.query.msg);
                break;
        }
        res.status(200).send("OK");
    });

    express.get(/.*\/application\.js$/, function (req, res) {
        WebServer.render(res, "js/application", {
            servers : that._servers
        }, "text/javascript");
    });

    express.get("/", function (req, res) {
        WebServer.render(res, "index", {
            servers : that._servers
        });
    });

    express.get("/:serverId?/:view?", function (req, res) {
        var params = req.params;
        params.view = params.view || "index";

        that.getClient(params.serverId).then(function (embyClient) {
            embyClient.useParams(req.query);

            if (utils.equalsIgnoreCase(params.view, "library")) {
                var promises = [ {
                    promise : embyClient.getItems().then(function (result) {
                        var items = result.Items;
                        var ps = [];

                        items.forEach(function (item) {
                            ps.push({
                                promise : embyClient.getLatestItems(item.Id, {
                                    limit : 16
                                })
                            });
                        });

                        return new Promise(function (resolve, reject) {
                            utils.promiseParallel(ps).then(function (res) {
                                items.forEach(function (pi, i) {
                                    pi.latestItems = res[i];
                                });
                                resolve(items);
                            }, reject);
                        });
                    }),
                    resultName : "items"
                } ];

                utils.promiseParallel(promises).then(function (result) {
                    WebServer.render(res, "library/shelf", utils.mapPromiseResults({
                        params : params,
                        query : req.query
                    }, promises, result));
                }, function (error) {
                    res.status(500).send(error);
                });
                return;
            }

            WebServer.render(res, params.view, {
                servers : that._servers,
                serverId : params.serverId,
            });
        }, function (error) {
            logger.error(error.message);
            res.status(500).send(error);
        });
    });

    express.get("/:serverId/:libType/:libId/:view?", function (req, res) {
        var params = req.params;
        params.view = params.view || "index";

        that.getClient(params.serverId).then(function (embyClient) {
            embyClient.useParams(req.query);

            var promises = [];

            if (utils.equalsIgnoreCase(params.libType, "tvshows") && utils.equalsIgnoreCase(params.view, "index")) {
                promises.push({
                    promise : new Promise(function (resolve) {
                        resolve([]);
                    })
                });
            } else if (utils.equalsIgnoreCase(params.libType, "tvshows") && utils.equalsIgnoreCase(params.view, "newest")) {
                promises.push({
                    promise : embyClient.getItems(params.libId, {
                        sortBy : "DatePlayed",
                        SortOrder : "Descending",
                        Filters : "IsResumable",
                        includeItemTypes : "Episode",
                        Fields : [ "AudioInfo", "SeriesInfo", "ParentId", "PrimaryImageAspectRatio", "BasicSyncInfo" ].join(","),
                        recursive : true,
                        limit : 12
                    }),
                    resultName : "resumable",
                    resultProperty : "Items"
                }, {
                    promise : embyClient.getNextUpEpisodes(params.libId, {
                        limit : 12
                    }),
                    resultName : "next",
                    resultProperty : "Items"
                });
            } else if (utils.equalsIgnoreCase(params.libType, "tvshows") && utils.equalsIgnoreCase(params.view, "genres")) {
                promises.push({
                    promise : embyClient.getGenres(params.libId, {
                        includeItemTypes : "Series",
                    }).then(function (result) {
                        var items = result.Items;
                        var ps = [];

                        items.forEach(function (item) {
                            ps.push({
                                promise : embyClient.getItems(params.libId, {
                                    GenreIds : item.Id,
                                    includeItemTypes : "Series",
                                    Fields : [ "AudioInfo", "SeriesInfo", "ParentId", "PrimaryImageAspectRatio", "BasicSyncInfo" ].join(","),
                                }),
                                resultName : "items",
                                resultProperty : "Items"
                            });
                        });

                        return new Promise(function (resolve, reject) {
                            utils.promiseParallel(ps).then(function (res) {
                                items.forEach(function (pi, i) {
                                    pi.Items = res[i].Items;
                                });
                                resolve(items);
                            }, reject);
                        });
                    }),
                    resultName : "items"
                });
            } else if (utils.equalsIgnoreCase(params.libType, "music")) {
                promises.push({
                    promise : embyClient.getItems(params.libId, {
                        IncludeItemTypes : "MusicAlbum",
                        recursive : true
                    }),
                    resultName : "items",
                    resultProperty : "Items"
                });
            } else {
                promises.push({
                    promise : embyClient.getItems(params.libId),
                    resultName : "items",
                    resultProperty : "Items"
                });
            }

            utils.promiseParallel(promises).then(function (result) {
                logger.debug(result[0]);
                WebServer.render(res, params.libType + "/" + params.view || "index", utils.mapPromiseResults({
                    params : params,
                    query : req.query
                }, promises, result));
            }, function (reject) {
                logger.error(reject.message);
                res.status(500).send(reject);
            });
        }, function (error) {
            logger.error(error.message);
            res.status(500).send(error);
        });
    });

    express.get("/:serverId/:libType/:libId/:itemType/:itemId/:view?", function (req, res) {
        var params = req.params;
        params.view = params.view || "index";

        that.getClient(params.serverId).then(function (embyClient) {
            embyClient.useParams(req.query);

            var promises = [ {
                promise : embyClient.getItem(params.itemId),
                resultName : "item"
            } ];

            if (utils.equalsIgnoreCase(params.itemType, "boxset")) {
                promises.push({
                    promise : embyClient.getItems(params.itemId),
                    optional : true,
                    resultName : "items",
                    resultProperty : "Items"
                });
            } else if (utils.equalsIgnoreCase(params.itemType, "movie")) {
                promises.push({
                    promise : embyClient.getSimilarItems(params.itemId, {
                        limit : 10
                    }),
                    optional : true,
                    resultName : "items",
                    resultProperty : "Items"
                });

                if (utils.equalsIgnoreCase(params.view, "index-bd")) {
                    promises.push({
                        promise : utils.imgBackgroundDominant(embyClient.getImageUrl(params.itemId, {
                            type : "Backdrop",
                            quality : 80,
                            maxHeight : 1080
                        })).then(function (result) {
                            return new Promise(function (resolve) {
                                resolve({
                                    titleColor : result[1].brighten().hex(),
                                    metadataColor : result[1].brighten().hex()
                                })
                            });
                        }),
                        optional : true,
                        resultName : "colors",
                    });
                }
            } else if (utils.equalsIgnoreCase(params.itemType, "series")) {
                promises.push({
                    promise : embyClient.getSeasons(params.itemId),
                    optional : true,
                    resultName : "items",
                    resultProperty : "Items"
                });
            } else if (utils.equalsIgnoreCase(params.itemType, "season")) {
                promises.push({
                    promise : embyClient.getEpisodes(req.query.seriesId, params.itemId),
                    resultName : "items",
                    resultProperty : "Items"
                });
            } else if (utils.equalsIgnoreCase(params.itemType, "episode") && utils.equalsIgnoreCase(params.view, "index")) {
                promises.push({
                    promise : embyClient.getEpisodes(req.query.seriesId, req.query.seasonId),
                    resultName : "items",
                    resultProperty : "Items"
                });
            } else if (utils.equalsIgnoreCase(params.itemType, "person")) {
                promises.push({
                    promise : embyClient.getItems(undefined, {
                        personIds : params.itemId,
                        includeItemTypes : req.query.includeItemTypes,
                        Fields : [ "AudioInfo", "SeriesInfo", "ParentId", "PrimaryImageAspectRatio", "BasicSyncInfo" ].join(","),
                        recursive : true,
                    }),
                    optional : true,
                    resultName : "relatedItems",
                    resultProperty : "Items"
                });
            } else if (utils.equalsIgnoreCase(params.itemType, "musicalbum")) {
                promises.push({
                    promise : embyClient.getItems(params.itemId, {
                        AlbumIds : params.itemId
                    }),
                    resultName : "items",
                    resultProperty : "Items"
                });
            }

            utils.promiseParallel(promises).then(function (result) {
                logger.debug(result[0]);
                WebServer.render(res, params.libType + "/" + params.itemType + "/" + params.view, utils.mapPromiseResults({
                    params : params,
                    query : req.query
                }, promises, result));
            }, function (error) {
                logger.error(error.message);
                res.status(500).send(error);
            });
        }, function (error) {
            logger.error(error.message);
            res.status(500).send(error);
        });
    });
};

Application.prototype.run = function () {
    var that = this;

    this._localIP = utils.getIPAddress();
    logger.info("local IP address obtained " + this._localIP);

    this._dnsServer = new DNSProxy(this._localIP, [ {
        domain : this._params.host,
        address : this._localIP
    } ]);

    this._webServer = new WebServer(this._localIP, {
        host : this._params.host,
        ssl : this._params.skipSSL === true ? false : true
    });

    this._dnsServer.start();
    this._webServer.start();

    EmbyClient.findServers(5000, function (servers) {
        if (servers.length !== 0) {
            that._servers = servers;
        } else {
            logger.warn("no Emby server was found, try to use from arguments");
            if (that._params.emby && that._params.user && that._params.pass) {
                that._servers = [ {
                    Address : that._params.emby,
                    UserName : that._params.user,
                    Password : that._params.pass,
                    client : new EmbyClient(that._params.emby, that._params.user, that._params.pass)
                } ];

                that._servers[0].client.login().then(function (authInfo) {
                    that._servers[0].Id = authInfo.ServerId;
                }, function (error) {
                    logger.error(error.message || error);
                    process.exit(1);
                });
            } else {
                logger.error("missing Emby address, username and password.");
                process.exit(1);
            }
        }
    });

    this.initRouting();
};

module.exports = Application;