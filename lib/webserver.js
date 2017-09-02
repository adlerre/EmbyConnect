var logger = new (require(__dirname + "/logger"))("WebServer");
var express = require("express");
var i18n = require("i18n");
var ejs = require("ejs");
var http = require("http");
var https = require("https");
var path = require("path");
var fs = require("fs");
var langs = require("langs");

var WebServer = function(address, options) {
	var that = this;
	this._address = address;
	this._options = options || {
		key : fs.readFileSync("assets/certificates/trailers.key"),
		cert : fs.readFileSync("assets/certificates/trailers.pem")
	};
	
	this._express = express();

	this._express.engine(".tpl", require("ejs").__express);
	this._express.set("views", path.join(__dirname, "../assets/templates/"));
	this._express.set("view engine", "tpl");
	
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

WebServer.prototype.start = function() {
	logger.info("binding HTTP Server on " + this._address);
	http.createServer(this._express).listen(80);

	logger.info("binding HTTPS Server on " + this._address);
	https.createServer(this._options, this._express).listen(443);
};

WebServer.prototype.express = function() {
	return this._express;
};

WebServer.render = function(res, template, options, contentType) {
	logger.info("render template " + template);
	res.setHeader("content-type", contentType || "text/xml");
	res.render(template, options);
};

module.exports = WebServer;