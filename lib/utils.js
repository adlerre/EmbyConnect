var vibrant = require("node-vibrant");

var utils = {
    getIPAddress : function () {
        var interfaces = require("os").networkInterfaces();
        for ( var devName in interfaces) {
            var iface = interfaces[devName];

            for (var i = 0; i < iface.length; i++) {
                var alias = iface[i];
                if (alias.family === "IPv4" && alias.address !== "127.0.0.1" && !alias.internal)
                    return alias.address;
            }
        }

        return "0.0.0.0";
    },

    promiseParallel : function (chain) {
        return new Promise(function (resolve, reject) {
            var numProcessing = chain.length;
            var result = [];

            chain.forEach(function (obj, i) {
                var optional = obj.optional || false;
                obj.promise.then(function (res) {
                    result[i] = res;
                    numProcessing--;

                    if (numProcessing === 0) {
                        resolve(result);
                    }
                }, !optional ? reject : function (error) {
                    console.log(error);
                    result[i] = null;
                    numProcessing--;

                    if (numProcessing === 0) {
                        resolve(result);
                    }
                });
            });
        });
    },

    mapPromiseResults : function (options, promises, results) {
        options = options || {};

        promises.forEach(function (p, i) {
            if (p.resultName) {
                if (p.resultProperty) {
                    options[p.resultName] = results[i][p.resultProperty] || [];
                } else {
                    options[p.resultName] = results[i] || {};
                }
            }
        });

        return options;
    },

    imgBackgroundDominant : function (url) {
        return new Promise(function (resolve, reject) {
            vibrant.from(url).getPalette(function (error, palette) {
                if (error !== null) {
                    reject(error);
                    return;
                }
                resolve(palette);
            });
        });
    },

    extend : function (origin, add) {
        if (!add || (typeof add !== "object" && add !== null)) {
            return origin;
        }

        var keys = Object.keys(add);
        var i = keys.length;
        while (i--) {
            origin[keys[i]] = add[keys[i]];
        }
        return origin;
    },

    equalsIgnoreCase : function (str, eqs) {
        return str.toLowerCase() === eqs.toLowerCase();
    }
};

module.exports = utils;