/**
 * Logger
 */
function log(msg, level) {
    level = level || "info";
    var req = new XMLHttpRequest();
    var url = "<%=: ['logger'] | buildUrl %>" + "?level=" + level + "&msg=" + encodeURIComponent(msg);
    req.open("GET", url, false);
    req.send();
};

function fetch(options, callback, errorCallback) {
    if (typeof (options) === "string") {
        var url = options;
        options = {
            url : url
        };
    }

    if (!options.url) {
        throw "loadURL requires a url argument";
    }

    options.method = options.method || "GET";
    options.headers = options.headers || {}
    options.responseType = options.responseType || "plain";

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        try {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    if ("plain" === options.responseType) {
                        callback(xhr.responseText);
                    } else if ("json" === options.responseType) {
                        callback(JSON.parse(xhr.responseText));
                    } else if ("xml" === options.responseType) {
                        callback(xhr.responseXML);
                    }
                } else if (xhr.status === 301 || xhr.status === 302) {
                    if (typeof (errorCallback) === "function") {
                        errorCallback(xhr);
                        return;
                    }
                    callback(xhr.responseText);
                } else {
                    log("received HTTP status " + xhr.status + " for " + options.url, "error");
                    if (typeof (errorCallback) === "function") {
                        errorCallback(xhr);
                        return;
                    }
                    callback(null);
                }
            }
        } catch (e) {
            log("caught exception while processing request for " + options.url + ". Aborting. Exception: " + e, "error");
            xhr.abort();
            if (typeof (errorCallback) === "function") {
                errorCallback(xhr, e);
                return;
            }
            callback(null);
        }
    }
    xhr.open(options.method, options.url, true);

    for ( var key in options.headers) {
        xhr.setRequestHeader(key, options.headers[key]);
    }

    if (options.body) {
        xhr.send(options.body);
    } else {
        xhr.send();
    }

    return xhr;
};

/**
 * Polyfills
 */

// atv.Document extensions
if (atv.Document) {
    atv.Document.prototype.getElementById = function (id) {
        var elements = this.evaluateXPath("//*[@id='" + id + "']", this);
        if (elements && elements.length > 0) {
            return elements[0];
        }
        return undefined;
    }
}

// atv.Element extensions
if (atv.Element) {
    atv.Element.prototype.getElementsByTagName = function (tagName) {
        return this.ownerDocument.evaluateXPath("descendant::" + tagName, this);
    }

    atv.Element.prototype.getElementByTagName = function (tagName) {
        var elements = this.getElementsByTagName(tagName);
        if (elements && elements.length > 0) {
            return elements[0];
        }
        return undefined;
    }

    atv.Element.prototype.getTextContent = function (tagName) {
        var element = this.getElementByTagName(tagName);
        if (element && element.textContent)
            return element.textContent;
        else
            return '';
    }
}

/**
 * Player Helper
 */

var player = {
    baseURL : "<%=: ['player'] | buildUrl %>",

    metadata : function (forceReload) {
        if (!this._metadata || forceReload === true) {
            var metadata = atv.player.asset.getElementByTagName("metadata");
            if (metadata != null) {
                this._metadata = {
                    serverId : metadata.getTextContent("serverId"),
                    seriesId : metadata.getTextContent("seriesId"),
                    mediaSourceId : metadata.getTextContent("mediaSourceId")
                }
            }
        }

        return this._metadata;
    },

    positionTicks : function (timeIntervalSec) {
        if (timeIntervalSec) {
            this._positionTicks = parseInt(timeIntervalSec * 10000000) || 0;
        }

        return this._positionTicks || 0;
    },

    playingStart : function () {
        var metadata = this.metadata();

        var xhr = new XMLHttpRequest();
        xhr.open("POST", this.baseURL, false);
        xhr.setRequestHeader("content-type", "application/json");
        xhr.send(JSON.stringify({
            state : "start",
            serverId : metadata.serverId,
            seriesId : metadata.seriesId,
            mediaSourceId : metadata.mediaSourceId
        }));
    },

    playingStopped : function () {
        var metadata = this.metadata();

        var xhr = new XMLHttpRequest();
        xhr.open("POST", this.baseURL, false);
        xhr.setRequestHeader("content-type", "application/json");
        xhr.send(JSON.stringify({
            state : "stopped",
            serverId : metadata.serverId,
            seriesId : metadata.seriesId,
            mediaSourceId : metadata.mediaSourceId,
            positionTicks : this.positionTicks()
        }));
    },

    playingPaused : function () {
        var metadata = this.metadata();

        var xhr = new XMLHttpRequest();
        xhr.open("POST", this.baseURL, false);
        xhr.setRequestHeader("content-type", "application/json");
        xhr.send(JSON.stringify({
            state : "paused",
            serverId : metadata.serverId,
            seriesId : metadata.seriesId,
            mediaSourceId : metadata.mediaSourceId,
            positionTicks : this.positionTicks()
        }));
    },

    playingProgress : function () {
        var metadata = this.metadata();

        var xhr = new XMLHttpRequest();
        xhr.open("POST", this.baseURL, false);
        xhr.setRequestHeader("content-type", "application/json");
        xhr.send(JSON.stringify({
            state : "progress",
            serverId : metadata.serverId,
            seriesId : metadata.seriesId,
            mediaSourceId : metadata.mediaSourceId,
            positionTicks : this.positionTicks()
        }));
    }
};

/**
 * Player Events
 */
atv.player.playerStateChanged = function (newState, timeIntervalSec) {
    if (newState.toLowerCase() === "loading") {
        player.metadata(true);
        player.positionTicks(0);
    } else if (newState.toLowerCase() === "stopped") {
        player.playingStopped();
        player.positionTicks(0);
    } else if (newState.toLowerCase() === "playing") {
        player.playingStart();
    } else if (newState.toLowerCase() === "paused") {
        player.positionTicks(timeIntervalSec);
        player.playingPaused();
    }
}

atv.player.playerTimeDidChange = function (timeIntervalSec) {
    if (timeIntervalSec * 10000000 < player.positionTicks() + 100000000)
        return;

    player.positionTicks(timeIntervalSec);
    player.playingProgress();
}

/**
 * Main App
 */
atv.config = {
    "doesJavaScriptLoadRoot" : true,
    "DEBUG_LEVEL" : 4
};

atv.onAppEntry = function () {
    var url = "<%=: [] | buildUrl %>";
    var serverId = atv.localStorage.getItem("emby-serverId");
    var user = atv.localStorage.getItem("emby-userName");
    var password = atv.localStorage.getItem("emby-password");

    if (serverId && user) {
        log("Authenticate on server \"" + serverId + "\" with user \"" + user + "\"", "debug");
        fetch({
            url : url + "login",
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({
                serverId : serverId,
                user : user,
                password : password || ""
            })
        }, function (response) {
            atv.loadURL(url + serverId);
        }, function (xhr) {
            if (xhr && (xhr.status === 301 || xhr.status === 302)) {
                if (xhr.responseText.indexOf("http") === 0) {
                    url = xhr.responseText;
                } else {
                    url += xhr.responseText.indexOf("/") === 0 ? xhr.responseText.substring(1) : xhr.responseText;
                }
            }
            atv.loadURL(url);
        });
    } else {
        atv.loadURL(url + "settings");
    }
};

atv.onGenerateRequest = function (request) {
    if (request.url.indexOf("<%=: [] | buildUrl %>") != -1) {
        var sep = "&";
        if (request.url.indexOf("?") == -1 && request.url.indexOf("&") == -1) {
            sep = "?";
        }
        request.url = request.url + sep + "deviceId=" + atv.device.udid;
        request.url = request.url + "&" + "deviceName=" + encodeURIComponent(atv.device.displayName);
    }

    log("atv.onGenerateRequest done: " + request.url, "debug");
};