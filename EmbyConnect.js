#!/usr/bin/env node
var program = require("commander");
var Application = require(__dirname + "/lib/application");

program.version("0.0.1");
program.description("inits EmbyConnect with given options or use defaults");
program.usage("[options]");
program.option("--host [hostname]", "hostname to mount the hack", "trailers.apple.com");
program.option("-e, --emby [server address]", "Emby server address");
program.option("-u, --user [username]", "username for Emby login");
program.option("-p, --pass [password]", "password for Emby login");
program.option("--skipSSL", "skip https server start", false);
program.parse(process.argv);

var app = new Application(program);
app.run();