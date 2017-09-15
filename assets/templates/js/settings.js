var Settings = function (appUrl) {
    this._appUrl = appUrl;
    this._servers = [];
    this._users = [];

    if (!this._appUrl) {
        logger.error("requires a url argument");
    }

    this.discoverServers();
};

Settings.prototype.getServerById = function (serverId, wantIdx) {
    if (serverId) {
        for ( var i in this._servers) {
            var srv = this._servers[i];
            if (serverId === srv.Id) {
                return wantIdx === true ? i : srv;
            }
        }
    }

    return undefined;
};

Settings.prototype.discoverServers = function () {
    var that = this;
    logger.debug("discover servers");

    atvutils.fetch({
        url : this._appUrl + "discover",
        responseType : "json"
    }, function (servers) {
        var elm = document.getElementById("selectServer");
        var label = elm.getElementByTagName("rightLabel");

        if (servers) {
            logger.debug(JSON.stringify(servers));
            that._servers = servers;
            if (that._servers.length === 1) {
                toggleAccessorie("selectServer", "arrow");
            }

            var serverId = atvutils.keyValuePair("emby-serverId");

            if (serverId) {
                that._serverIdx = that.getServerById(serverId, true);
                that._serverId = serverId;
            } else {
                that._serverIdx = 0;
                that._serverId = that._servers[that._serverIdx].Id;
                atvutils.keyValuePair("emby-serverId", that._serverId);
            }

            label.textContent = servers[that._serverIdx].Name;

            that.getUsers();
        } else {
            label.textContent = "<%=: __('settings.error.noServerFound') %>";
        }
    });
};

Settings.prototype.getUser = function (user, isId, wantIdx) {
    if (user) {
        for ( var i in this._users) {
            var usr = this._users[i];
            if ((isId === true && user === usr.Id) || user === usr.Name) {
                return wantIdx === true ? i : usr;
            }
        }
    }

    return undefined;
};

Settings.prototype.getUsers = function () {
    var that = this;
    logger.debug("get users");

    atvutils.fetch({
        url : this._appUrl + this._serverId + "/users",
        responseType : "json"
    }, function (users) {
        logger.debug(JSON.stringify(users));

        var elm = document.getElementById("user");
        var label = elm.getElementByTagName("rightLabel");

        that._users = users;
        if (that._users.length === 1) {
            toggleAccessorie("user", "arrow");
        }

        var userName = atvutils.keyValuePair("emby-userName");

        if (userName) {
            that._userName = userName;
        } else {
            that._userName = that._users[0].Name;
            if (this._users[0].HasPassword === false) {
                atvutils.keyValuePair("emby-userName", that._userName);
            }
        }

        label.textContent = that._userName;
    });
};

Settings.prototype.selectServer = function () {
    logger.debug("select server");

    if (this._servers.length !== 0) {
        var elm = document.getElementById("selectServer");
        var label = elm.getElementByTagName("rightLabel");

        this._serverIdx = this._serverIdx < this._servers.length - 1 ? this._serverIdx + 1 : 0;
        this._serverId = this._servers[this._serverIdx].Id;
        atvutils.keyValuePair("emby-serverId", this._serverId);

        label.textContent = this._servers[this._serverIdx].Name;
    } else {
        this.discoverServers();
    }
};

Settings.prototype.selectUser = function () {
    var that = this;
    logger.debug("select user");

    if (this._users.length !== 0) {
        var elm = document.getElementById("user");
        var label = elm.getElementByTagName("rightLabel");

        var idx = parseInt(this.getUser(this._userName, false, true));
        idx = idx < this._users.length - 1 ? idx + 1 : 0;
        this._userName = this._users[idx].Name;

        if (this._users[idx].HasPassword === false) {
            atvutils.keyValuePair("emby-userName", this._userName);
            atvutils.removeKeyValuePair("emby-password");
        } else {
            atvutils.showTextEntryPage("password", "<%=: __('settings.passwordFor') %> " + that._userName, "", function (password) {
                atvutils.keyValuePair("emby-userName", that._userName);
                atvutils.keyValuePair("emby-password", password);
            }, function () {
                logger.debug("canceled passwort input");
            }, "");
        }

        label.textContent = this._userName;
    } else {
        this.getUsers();
    }
};

var settings = new Settings("<%=: [] | buildUrl %>");