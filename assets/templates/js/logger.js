var logger = {

    log : function (msg, level) {
        level = level || "info";
        var req = new XMLHttpRequest();
        var url = "<%=: ['logger'] | buildUrl %>" + "?level=" + level + "&msg=" + encodeURIComponent(msg);
        req.open("GET", url, false);
        req.send();
    },

    info : function (msg) {
        logger.log(msg, "info");
    },

    error : function (msg) {
        logger.log(msg, "error");
    },

    warn : function (msg) {
        logger.log(msg, "warn");
    },

    debug : function (msg) {
        logger.log(msg, "debug");
    }

};