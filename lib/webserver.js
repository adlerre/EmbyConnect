var logger = new (require(__dirname + "/logger"))("WebServer");
var utils = require(__dirname + "/utils");
var express = require("express");
var bodyParser = require("body-parser");
var i18n = require("i18n");
var ejs = require("ejs");
var http = require("http");
var https = require("https");
var path = require("path");
var fs = require("fs");
var langs = require("langs");

var WebServer = function (address, options) {
    var that = this;
    this._address = address;
    this._options = options || {
        host : "trailers.apple.com",
        ssl : true
    };

    this._express = express();

    this._express.engine(".tpl", require("ejs").__express);
    this._express.set("views", path.join(__dirname, "../assets/templates/"));
    this._express.set("view engine", "tpl");
    
    this._express.use(bodyParser.json());
    this._express.use(bodyParser.urlencoded({
        extended: true
    }));
    this._express.use(function(req, res, next) {
        if (req.url.indexOf("/logger") === -1) {
            logger.info(req.method + " " + req.url);
        }
        next();
    }, express.static(path.join(__dirname, "../assets/")));
    
    i18n.configure({
        locales: ["en", "de"],
        objectNotation: true,
        updateFiles: false,
        register: global,
        directory: __dirname + "/../assets/locales/"
    });
    this._express.use(i18n.init);

    ejs.filters.buildUrl = function(parts, query) {
        var queryString = "";
        
        if (query) {
            var i = 0;
            for (var key in query) {
                queryString += i === 0 ? "?" : "&";
                queryString += key + "=" + query[key];
                i++;
            }
        }
        
        return "http://" + that._address + "/" + parts.join("/") + queryString;
    };
    
    ejs.filters.i18nN = function(num, key) {
        return __n(key, num === 0 ? 1 : num);
    };
    
    ejs.filters.language = function(code) {
        return langs.has("2B", code) ? langs.where("2B", code).local : __("label.unknown");
    };
};

WebServer.prototype.initSSL = function () {
    var that = this;

    return new Promise(function (resolve, reject) {
        var chalk = require("chalk");
        var forge = require("node-forge");
        var host = that._options.host;

        if (!host) {
            reject(new Error("Must supply a hostname"));
        }

        var filePrefix = __dirname + "/../assets/certificates/" + host;
        fs.exists(filePrefix + ".key", function (exists) {
            if (!exists) {
                logger.info("generating keypair and certificate for " + host + "...");
                var attrs = [ {
                    name : "commonName",
                    value : host
                }, {
                    name : "countryName",
                    value : "US"
                } ];
                var pems = require("selfsigned").generate(attrs, {
                    algorithm : "sha256",
                    keySize : 2048,
                    days : 7300,
                    extensions : [ {
                        name : "basicConstraints",
                        cA : true
                    }, {
                        name : "keyUsage",
                        keyCertSign : true,
                        digitalSignature : true,
                        nonRepudiation : true,
                        keyEncipherment : true,
                        dataEncipherment : true
                    } ]
                });

                fs.writeFileSync(filePrefix + ".pubkey", pems["public"]);
                fs.writeFileSync(filePrefix + ".key", pems["private"]);
                fs.writeFileSync(filePrefix + ".pem", pems["cert"]);

                logger.info("generating DER encoded certificate for " + host + "...")
                var asn1Obj = forge.pki.certificateToAsn1(forge.pki.certificateFromPem(pems["cert"]));
                fs.writeFileSync(filePrefix + ".cer", new Buffer(forge.asn1.toDer(asn1Obj).getBytes(), "binary"));
                logger.info("install certificate form " + chalk.whiteBright("http://" + host + "/certificates/" + host + ".cer"));
            }

            logger.info("load key and certificate for " + host + "...")
            that._options = utils.extend(that._options, {
                key : fs.readFileSync(filePrefix + ".key"),
                cert : fs.readFileSync(filePrefix + ".pem")
            });

            resolve();
        });
    });
};

WebServer.prototype.start = function () {
    var that = this;

    logger.info("binding HTTP Server on " + this._address);
    http.createServer(this._express).listen(80);

    if (this._options.ssl === true) {
        this.initSSL().then(function () {
            logger.info("binding HTTPS Server on " + that._address);
            https.createServer({
                key : that._options.key,
                cert : that._options.cert,
            }, that._express).listen(443);
        }, function (error) {
            logger.error(error);
        });
    }
};

WebServer.prototype.express = function () {
    return this._express;
};

module.exports = WebServer;