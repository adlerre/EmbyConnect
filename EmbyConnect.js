#!/usr/bin/env node
var program = require("commander");
var Application = require(__dirname + "/lib/application");

var app = new Application();

program.version(app.getVersion());
program.description("inits EmbyConnect with given options or use defaults");
program.usage("[options]");
program.option("--host [hostname]", "hostname to mount the hack", "trailers.apple.com");
program.option("-e, --emby [server address]", "Emby server address");
program.option("--skipSSL", "skip https server start", false);
program.parse(process.argv);

app.run(program);