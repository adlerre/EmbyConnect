var logger = new (require(__dirname + "/logger"))("EmbyClient");
var utils = require(__dirname + "/utils");
var dateformat = require("dateformat");
var ejs = require("ejs");
var i18n = require("i18n");
var http = require("http");
var httpProxy = require("http-proxy");

var EmbyClient = function(serverAddress, userName, password) {
	var that = this;
	this._useProxy = true;
	
	this._serverAddress = serverAddress;
	this._userName = userName;
	this._password = password;

	this._deviceName = "Apple TV 3";
	this._deviceId = "1234567890";
	this._devicePixelRatio = 1;
	
	if (this._useProxy) {
		var proxy = httpProxy.createProxyServer({});
		var embyProxy = http.createServer(function(req, res) {
			proxy.web(req, res, {
				target : that._serverAddress
			});
		});
		embyProxy.listen(5050);
		this._proxyUrl = "http://" + utils.getIPAddress() + ":5050";
	}
	
	this._api = new (require("emby-apiclient"))(
			this._proxyUrl || this._serverAddress, "EmbyConnect", "0.0.1", this._deviceName,
			this._deviceId, this._devicePixelRatio);
	this.login();
	
	ejs.filters.people = function(people, type, num) {
		num = num || 1;
		var res = [];
		
		people.forEach(function(p) {
			if (res.length < num && p.Type === type) {
				res.push(p.Name);
			}
		});
		return res;
	};
	
	ejs.filters.mediaBadges = function(mediaSources, type) {
		var mi = (mediaSources[0].Name).split("/");
		if (type === "audio") {
			return "AC3|DTS".indexOf(mi[2]) !== -1 ? "dolbyDigital" : null;
		} else if (type === "video") {
			var h = parseInt(mi[0]);
			if (h > 1080) {
				return "SuperHD";
			} else if (h >= 720) {
				return "HD";
			} else {
				return "SD";
			}
		}
	};
	
	ejs.filters.title = function(item) {
	    switch (item.Type.toLowerCase()) {
	    case "episode":
	        return item.SeriesName;
	        break;
	    default:
	        return item.Name;
	    }
	};
	
	ejs.filters.subtitle = function(item) {
        switch (item.Type.toLowerCase()) {
        case "episode":
            return "S" + item.ParentIndexNumber + ":E" + item.IndexNumber + " "+ item.Name;
            break;
        case "musicalbum":
            return item.AlbumArtist;
            break;
        case "series":
            return item.Status === "Continuing" ? __n("%s-today", item.ProductionYear) : item.ProductionYear + "-" + new Date(item.EndDate).getFullYear();
            break;
        default:
            return item.ProductionYear || "\xAD";
        }
    };
    
    ejs.filters.posterType = function(item) {
        var aspectRatio = item.PrimaryImageAspectRatio || 0.6;
        if (aspectRatio == 1) {
            return "squarePoster";
        } else if (aspectRatio >= 1.3) {
            return "fourByThreePoster";
        } else if (aspectRatio >= 1.7) {
            return "sixteenByNinePoster";
        }
        
        return "moviePoster";
    };

	ejs.filters.imageUrl = function(itemId, type, height, width) {
		var options = {
			type : type || "Primary",
			quality : 80
		};

		if (height && height !== -1) {
			options.maxHeight = height;
		}
		
		if (width && width !== -1) {
			options.maxWidth = width;
		}

		return that.getImageUrl(itemId, options);
	};

	ejs.filters.streamUrl = function(item, options) {
		var mediaSourceId = item.MediaSources.length === 1 ? item.MediaSources[0].Id : undefined;
		item.MediaSources.forEach(function(stream) {
			if (stream.Type === "Video" && mediaSourceId === undefined) {
				mediaSourceId = stream.Id;
			}
		});
		
		return that.getStreamUrl(item.Id, mediaSourceId, options);
	};
	
	ejs.filters.extractText = function(val) {
		return val || "";
	};
	
	ejs.filters.pad = function(num, size) {
	    var s = num + "";
	    while (s.length < size) s = "0" + s;
	    return s;
	};

	ejs.filters.convertTicksToMinutes = function(currentTime) {
		timeMinute = Math.floor((currentTime / 10000 / 3600000) * 60);
		return timeMinute;
	};
	
	ejs.filters.convertTicksToTime = function(currentTime) {
        var time = currentTime / 10000 / 3600000;
        var h = Math.floor(time);
        var m = Math.floor(time * 60);
        var s = Math.floor((time * 60 - m) * 60);
        return (h == 0 ? "" : ejs.filters.pad(m, 2)) + ejs.filters.pad(m, 2) + ":" + ejs.filters.pad(s, 2);
    };
	
	ejs.filters.formatDate = function(str) {
	    return dateformat(new Date(str), __("format.date"));  
	};
};

EmbyClient.findServers = function(timeoutMs, callback) {
	var dgram = require("dgram");
	var PORT = 7359;
	var MULTICAST_ADDR = "255.255.255.255";

	var servers = [];
	var client;

	try {
		client = dgram.createSocket({
			type : "udp4",
			reuseAddr : true
		});
	} catch (err) {
		callback(servers);
		return;
	}

	function onReceive(message, info) {
		logger.info("Message from: " + info.address + ":" + info.port);
		logger.info("ServerDiscovery message received");
		try {
			if (info != null) {
				logger.info("Server discovery json: " + message.toString());
				var server = JSON.parse(message.toString());
				server.EndpointAddress = info.address;
				servers.push(server);
			}
		} catch (err) {
			logger.error("Error receiving server info: " + err);
		}
	}

	function onTimerExpired() {
		logger.info("timer expired " + servers.length + " servers received");
		logger.debug(servers);
		callback(servers);

		try {
			client.close();
		} catch (err) {

		}
	}

	client.on("message", onReceive);

	client.on("listening", function() {
		try {
			var address = client.address();
			client.setBroadcast(true);
			var message = new Buffer("who is EmbyServer?");
			client.send(message, 0, message.length, PORT, MULTICAST_ADDR,
					function(err) {
						if (err)
							console.error(err);
					});
			logger.info("UDP Client listening on " + address.address + ":"
					+ address.port);
			logger.debug("starting udp receive timer with timeout ms: "
					+ timeoutMs);
			timeoutMs = setTimeout(onTimerExpired, timeoutMs);
		} catch (err) {
			onTimerExpired();
		}
	});

	try {
		logger.info("starting Server discovery");
		client.bind();
	} catch (err) {
		onTimerExpired();
	}
};

EmbyClient.prototype.deviceName = function(deviceName) {
	if (deviceName) {
		this._deviceName = this._api._deviceName = deviceName;
	}

	return this._deviceName;
};

EmbyClient.prototype.deviceId = function(deviceId) {
	if (deviceId) {
		this._deviceId = this._api._deviceId = deviceId;
	}

	return this._deviceId;
};

EmbyClient.prototype.devicePixelRatio = function(devicePixelRatio) {
	if (devicePixelRatio) {
		this._devicePixelRatio = this._api._devicePixelRatio = devicePixelRatio;
	}

	return this._devicePixelRatio;
};

EmbyClient.prototype.accessToken = function(accessToken) {
	if (accessToken) {
		this._accessToken = accessToken;
	}

	return this._accessToken;
};

EmbyClient.prototype.userId = function(userId) {
	if (userId) {
		this._userId = userId;
	}

	return this._userId;
};

EmbyClient.prototype.isLoggedIn = function() {
	return this._api.isLoggedIn();
};

EmbyClient.prototype.login = function() {
	var that = this;
	var api = this._api;

	if (!this.isLoggedIn()) {
		return new Promise(function(resolve, reject) {
			api.authenticateUserByName(that._userName, that._password).then(
					function(auth) {
						that.accessToken(auth.AccessToken);
						that.userId(auth.User.Id);
						api.setAuthenticationInfo(auth.AccessToken,
								auth.User.Id);
						resolve();
					}, function(error) {
						logger.error(error.message || error);
						reject(error);
					});
		});
	}

	return Promise.resolve();
};

EmbyClient.prototype.apiCall = function(method, args) {
	var args = Array.prototype.slice.call(arguments, 1);
	var that = this;
	var api = this._api;

	if (!this.isLoggedIn()) {
		return new Promise(function(resolve, reject) {
			that.login().then(function() {
				method.apply(api, args).then(resolve, reject);
			}, reject)
		});
	}

	return method.apply(api, args);
};

EmbyClient.prototype.useParams = function(params) {
	if (params) {
		this.deviceId(params.deviceId);
		this.deviceName(params.deviceName);
	}
};

EmbyClient.prototype.getItems = function (itemId, options) {
    options = options || {};

    if (itemId) {
        options.parentId = itemId;
    }

    options = utils.extend({
        fields : [ "AudioInfo", "ParentId", "PrimaryImageAspectRatio", "BasicSyncInfo", "Path", "Genres", "Studios", "CumulativeRunTimeTicks", "Metascore",
                "SeriesStudio", "AirTime", "SeasonUserData" ].join(","),
        sortBy : "SortName",
        sortOrder : "Ascending",
        excludeLocationTypes : "Virtual",
        recursive : false,
        imageTypeLimit : 1,
        isVirtualUnAired : false,
        isMissing : false,
        CollapseBoxSetItems : false
    }, options);

    return this.apiCall(this._api.getItems, this.userId(), options);
};

EmbyClient.prototype.getItem = function(itemId) {
	return this.apiCall(this._api.getItem, this.userId(), itemId);
};

EmbyClient.prototype.getImageUrl = function(itemId, options) {
	return this._api.getImageUrl(itemId, options);
};

EmbyClient.prototype.getSimilarItems = function(itemId, options) {
	return this._api.getSimilarItems(itemId, options);
};

EmbyClient.prototype.getLatestItems = function(itemId, options) {
	options = options || {};
	
	if (itemId) {
		options.parentId = itemId;
	}
	
	options = utils.extend({
        Fields : [ "ParentId", "PrimaryImageAspectRatio", "BasicSyncInfo" ].join(","),
        EnableImageTypes : [ "Primary", "Backdrop", "Thumb" ].join(","),
    }, options);
	
	return this._api.getLatestItems(options);
};

EmbyClient.prototype.getSeasons = function(itemId, options) {
	options = options || {};
	
	options.userId = this.userId();
	
	return this._api.getSeasons(itemId, options);
};

EmbyClient.prototype.getEpisodes = function (parentId, seasonId, options) {
    options = options || {};

    if (seasonId) {
        options.seasonId = seasonId;
    }

    options.userId = this.userId();

    options = utils.extend({
        fields : [ "AudioInfo", "SeriesInfo", "SeriesStudio", "ParentId", "ItemCounts", "PrimaryImageAspectRatio", "BasicSyncInfo", "CanDelete", "Overview" ].join(","),
        isVirtualUnAired : false,
        isMissing : false
    }, options);

    return this._api.getEpisodes(parentId, options);
};

EmbyClient.prototype.getNextUpEpisodes = function(itemId, options) {
    options = options || {};
    
    options.userId = this.userId();
    
    if (itemId) {
        options.parentId = itemId;
    }
    
    options = utils.extend({
        Fields : [ "AudioInfo", "SeriesInfo", "SeriesStudio", "ParentId", "PrimaryImageAspectRatio", "BasicSyncInfo", "DateCreated" ].join(","),
        EnableImageTypes : [ "Primary", "Backdrop", "Thumb" ].join(","),
        recursive : true,
        imageTypeLimit : 1,
        ExcludeLocationTypes : "Virtual",
        collapseBoxSetItems : false,
    }, options);
    
    return this._api.getNextUpEpisodes(options);
};

EmbyClient.prototype.getUserViews = function(options) {
	return this.apiCall(this._api.getUserViews, options, this.userId());
};

EmbyClient.prototype.getGenres = function(itemId, options) {
	options = options || {};
	
	if (itemId) {
		options.parentId = itemId;
	}
	
	options = utils.extend({
        sortBy : "SortName",
        SortOrder : "Ascending",
        Fields : [ "AudioInfo", "SeriesInfo", "ParentId", "PrimaryImageAspectRatio", "BasicSyncInfo" ].join(","),
        recursive : true,
        imageTypeLimit : 1,
        ExcludeLocationTypes : "Virtual",
        collapseBoxSetItems : false
    }, options);
	
	return this.apiCall(this._api.getGenres, this.userId(), options);
};

EmbyClient.prototype.getThemeMedia = function(itemId, inherit) {
    return this.apiCall(this._api.getThemeMedia, this.userId(), itemId, inherit);
};

EmbyClient.prototype.getStreamUrl = function(itemId, mediaSourceId, options) {
	options = options || {
		VideoCodec : "h264",
		Profile : "high",
		Level : 41,
		MaxVideoBitDepth : 8,
		MaxWidth : 1920,
		VideoBitrate : 1000000,
		AudioCodec : "aac",
		MaxAudioChannels : 2,
		AudioBitrate : 160000,
		SubProtocol: "hls",
		MediaSourceId : mediaSourceId,
		DeviceId : this.deviceId(),
		api_key : this.accessToken(),
	};

	return this._api.getUrl("/Videos/" + itemId + "/master.m3u8", options);
};

module.exports = EmbyClient;