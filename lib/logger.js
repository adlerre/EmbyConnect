const chalk = require("chalk");

var Logger = function (module, debugEnabled) {
    this._module = module;
    this._debugEnabled = debugEnabled !== undefined ? debugEnabled : Logger.DebugEnabled;

    Logger.Modules[module] = this;
};

Logger.DebugEnabled = false;
Logger.Modules = {};

Logger.prototype.info = function (msg) {
    console.log((new Date()).toISOString() + " " + chalk.whiteBright("INFO") + " - " + this._module + ":", msg);
};

Logger.prototype.warn = function (msg) {
    console.log((new Date()).toISOString() + " " + chalk.yellow("WARNING") + " - " + this._module + ":", msg);
};

Logger.prototype.error = function (msg) {
    console.error((new Date()).toISOString() + " " + chalk.red("ERROR") + " - " + this._module + ":", msg);
};

Logger.prototype.debug = function (msg) {
    if (this._debugEnabled) {
        console.log((new Date()).toISOString() + " " + chalk.redBright("DEBUG") + " - " + this._module + ":", msg);
    }
};

module.exports = Logger;