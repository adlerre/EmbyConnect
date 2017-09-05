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
    <% if (servers.length === 1) { %>atv.loadURL("<%=: [servers[0].Id] | buildUrl %>");<% } %>
    <% if (servers.length > 1) { %>atv.loadURL("<%=: [] | buildUrl %>");<% } %>
    <% if (servers.length === 0) { %>
    var xmlstr =
"<?xml version=\"1.0\" encoding=\"UTF-8\"?> \
<atv> \
  <body> \
    <dialog id=\"error-dialog\"> \
      <title><%= __("error.title") %></title> \
      <description><%= __("error.noServerFound") %></description> \
    </dialog> \
  </body> \
</atv>";
        
    var doc = atv.parseXML(xmlstr);
    atv.loadXML(doc);
    <% } %>
};

atv.onGenerateRequest = function(request) {
	if (request.url.indexOf("<%=: [] | buildUrl %>") != -1) {
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