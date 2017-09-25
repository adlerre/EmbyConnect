var navbarCurrentItemId = null;

function loadMenuPage(event) {
    navbarCurrentItemId = event.navigationItemId;
    logger.debug("loadMenuPage: itemid " + navbarCurrentItemId);

    var item = document.getElementById(navbarCurrentItemId);
    var url = item.getElementByTagName("url").textContent;

    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        try {
            if (req.readyState === 4 && req.status === 200) {
                doc = req.responseXML
                if (event)
                    event.success(doc);
                else
                    atv.loadXML(doc);
            }
        } catch (e) {
            req.abort();
        }
    }
    req.open("GET", url, true);
    req.send();
};

function reloadNavbar(event) {
    logger.debug("reloadNavbar: itemid " + navbarCurrentItemId);

    if (navbarCurrentItemId === "settings") {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            try {
                if (req.readyState === 4 && req.status === 200) {
                    var doc = req.responseXML;

                    var navItems = document.rootElement.getElementsByTagName("navigationItem");
                    var rxNavItems = doc.rootElement.getElementsByTagName("navigationItem");

                    var changed = (navItems.length != rxNavItems.length);
                    var i = 0;
                    while (!changed && i < navItems.length) {
                        changed = (navItems[i].getAttribute("id") != rxNavItems[i].getAttribute("id"));
                        i++;
                    }

                    if (!changed) {
                        logger.debug("reloadNavbar done: settings unchanged - no action");
                        event.cancel();
                    } else {
                        var navbar = doc.rootElement.getElementByTagName("navigation");
                        var currentIndex = (rxNavItems.length - 1).toString();
                        navbar.setAttribute("currentIndex", currentIndex);

                        logger.debug("reloadNavbar done: settings changed - reload");
                        atv.loadAndSwapXML(doc);
                    }
                }
            } catch (e) {
                logger.error("caught exception while while reload navbar: " + e);
                req.abort();
            }
        };

        var serverId = atvutils.keyValuePair("emby-serverId");
        var user = atvutils.keyValuePair("emby-userName");
        var password = atvutils.keyValuePair("emby-password");

        var url = "<%=: [] | buildUrl %>" + serverId + "?user=" + encodeURIComponent(user) + "&password=" + encodeURIComponent(password || "");
        req.open("GET", url, false);
        req.send();
    } else {
        logger.debug("reloadNavbar done: itemId " + navbarCurrentItemId + " - no action");
        event.cancel();
    }
};