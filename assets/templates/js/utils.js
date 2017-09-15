var atvutils = ATVUtils = {

    fetch : function (options, callback) {
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
                        callback(null);
                    }
                }
            } catch (e) {
                logger.error("caught exception while processing request for " + options.url + ". Aborting. Exception: " + e, "error");
                xhr.abort();
                callback(null);
            }
        }
        xhr.open(options.method, options.url, true);

        for ( var key in options.headers) {
            xhr.setRequestHeader(key, options.headers[key]);
        }

        xhr.send();
        return xhr;
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