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

/**
 * Main App
 */
atv.config = { 
    "doesJavaScriptLoadRoot": true,
    "DEBUG_LEVEL": 4
};

atv.onAppEntry = function() {
    atv.loadURL("<%=: [serverId] | buildUrl %>");
};

atv.onGenerateRequest = function(request) {
	if (request.url.indexOf("<%=: [serverId] | buildUrl %>") != -1) {
		var sep = "&";
		if (request.url.indexOf("?") == -1 && request.url.indexOf("&") == -1) {
			sep = "?";
		}
		request.url = request.url + sep + "deviceId=" + atv.device.udid;
		request.url = request.url + "&" + "deviceName="
				+ encodeURIComponent(atv.device.displayName);
	}

	log("atv.onGenerateRequest done: " + request.url, "debug");
};