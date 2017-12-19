#!/usr/bin/env node
var fs = require("fs");
var program = require("commander");
var Application = require(__dirname + "/lib/application");

var app = new Application();

program.version(app.getVersion());
program.description("inits EmbyConnect with given options or use defaults");
program.usage("[options]");
program.option("--host [hostname]", "hostname to mount the hack", "trailers.apple.com");
program.option("-e, --emby [server address]", "Emby server address");
program.option("--skipSSL", "skip https server start", false);
program.option("--pidfile [pidfile]", "full pid file path");
program.parse(process.argv);

if (program.pidfile !== undefined) {
    fs.writeFile(program.pidfile, process.pid, function (err) {
        if (err) {
            return console.log(err);
        }
    });
}
app.run(program);
