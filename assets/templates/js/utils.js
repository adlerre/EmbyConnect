var atvutils = ATVUtils = {

    fetch : function (options, callback, errorCallback) {
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
                    } else {
                        logger.error("received HTTP status " + xhr.status + " for " + options.url);
                        if (typeof (errorCallback) === "function") {
                            errorCallback(xhr);
                            return;
                        }
                        callback(null);
                    }
                }
            } catch (e) {
                logger.error("caught exception while processing request for " + options.url + ". Aborting. Exception: " + e);
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
    },

    loadURLInternal : function (options, loader) {
        var that = this, xhr, proxy = new atv.ProxyDocument;

        proxy.show();

        proxy.onCancel = function () {
            if (xhr) {
                xhr.abort();
            }
        };

        xhr = that.fetch(options, function (xml) {
            try {
                loader(proxy, xml);
            } catch (e) {
                logger.error("Caught exception while loading " + url + ". " + e);
            }
        }, function (xhr, e) {
            if (xhr.status === 401) {
                var serverId = atv.localStorage.getItem("emby-serverId");
                var user = atv.localStorage.getItem("emby-userName");
                var password = atv.localStorage.getItem("emby-password");

                if (serverId && user) {
                    logger.debug("Authenticate on server \"" + serverId + "\" with user \"" + user + "\"");
                    atv.loadURL(options.url + "?user=" + encodeURIComponent(user) + "&password=" + encodeURIComponent(password || ""));
                } else {
                    atv.loadURL("<%=: ['settings'] | buildUrl %>");
                }
            }
        });
    },

    loadURL : function (url) {
        this.loadURLInternal({
            url : unescape(url),
            responseType : "xml"
        }, function (proxy, xml) {
            try {
                proxy.loadXML(xml, function (success) {
                    if (!success) {
                        logger.error("loadURL failed to load " + url);
                    }
                });
            } catch (e) {
                logger.error("Caught exception while loading " + url + ". " + e);
            }
        });
    },

    dump : function (obj, maxLevel) {
        maxLevel = maxLevel || 5;

        function d(obj, level) {
            level = level || 0;
            var output = "";

            var ident = "";
            for (var i = 0; i < level; i++) {
                ident += "  ";
            }

            for ( var property in obj) {
                if (level < maxLevel && typeof (obj[property]) === "object") {
                    output += ident + property + " {\n" + d(obj[property], level + 1) + " }\n";
                } else {
                    output += ident + property + ": " + obj[property] + ";\n";
                }
            }
            return output;
        }

        return d(obj, 0);
    },

    showTextEntryPage : function (inputType, inputTitle, inputInstructions, callbackSubmit, callbackCancel, defaultValue) {
        var textEntry = new atv.TextEntry();

        textEntry.type = inputType;
        textEntry.title = inputTitle;
        textEntry.instructions = inputInstructions;
        textEntry.defaultValue = defaultValue;
        textEntry.defaultToAppleID = false;
        // textEntry.image =
        textEntry.onSubmit = callbackSubmit;
        textEntry.onCancel = callbackCancel

        textEntry.show();
    },

    keyValuePair : function (key, value) {
        if (key && value) {
            try {
                atv.localStorage.setItem(key, value);
                return value;
            } catch (error) {
                logger.error("Failed to store key value pair: " + error);
            }
        } else if (key) {
            try {
                return atv.localStorage.getItem(key);
            } catch (error) {
                logger.error("Failed to retrieve key value pair: " + error);
            }
        }
        return null;
    },

    removeKeyValuePair : function (key) {
        try {
            atv.localStorage.removeItem(key);
        } catch (error) {
            logger.error("Failed to remove key value pair: " + error);
        }
    },

    popUpMenu : function (url) {
        var urlParts = url.split("?");
        fv = atv.device.softwareVersion.split(".");
        firmVer = fv[0] + "." + fv[1];
        if (parseFloat(firmVer) < 6.0) {
            url = urlParts[0] + "/options-dialog" + (urlParts[1] || "");
            logger.debug("use options dialog - " + url);
            atv.loadURL(url);
        } else {
            url = urlParts[0] + "/popup" + (urlParts[1] || "");
            logger.debug("use popup - " + url);
            this.fetch({
                url : unescape(url),
                responseType : "xml"
            }, function (xmlDoc) {
                atv.contextMenu.load(xmlDoc);
            });
        }
    }
};

var emby = {
    url : '<%=: [] | buildUrl %>',

    markWatched : function (serverId, libType, libId, itemType, itemId) {
        logger.debug("mark " + itemId + " as watched");

        var url = emby.url + [ serverId, libType, libId, itemType, itemId, "markWatched" ].join("/");
        atvutils.fetch({
            url : url
        }, function (result) {
            logger.debug(result);
            atv.contextMenu.cancel();
        });
    },

    markUnwatched : function (serverId, libType, libId, itemType, itemId) {
        logger.debug("mark " + itemId + " as unwatched");

        var url = emby.url + [ serverId, libType, libId, itemType, itemId, "markUnwatched" ].join("/");
        atvutils.fetch({
            url : url
        }, function (result) {
            logger.debug(result);
            atv.contextMenu.cancel();
        });
    }

}

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
            return "";
    }
}

/**
 * Element Helper
 */

function toggleAccessorie(id, type) {
    // arrow, checkMark, spinner
    type = type || "spinner";
    try {
        var menuItem = document.getElementById(id);

        var accessories = menuItem.getElementByTagName("accessories");
        if (accessories) {
            accessories.removeFromParent();
        } else {
            accessories = document.makeElementNamed("accessories");
            var elm = document.makeElementNamed(type);
            accessories.appendChild(elm);
            menuItem.appendChild(accessories);
        }
    } catch (error) {
        logger.error("Caught exception trying to toggle DOM element: " + error);
    }
}
