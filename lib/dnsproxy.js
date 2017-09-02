const dgram = require("dgram");
const logger = new (require("../lib/logger"))("DNSProxy");

var DNSProxy = function (address, domainRewrite) {
    this._address = address;
    this._upstreamServer = "8.8.8.8";
    this._domainRewrite = domainRewrite || [ {
        domain : "trailers.apple.com",
        address : address
    } ];
};

DNSProxy.prototype.resolveDNSDomain = function (msg) {
    var domain = [];
    var index = 12;
    var offset;
    while (offset = msg.readUInt8(index++)) {
        var sub = "";
        for (var i = 0; i < offset; i++) {
            sub += String.fromCharCode(msg.readUInt8(index++));
        }
        sub && domain.push(sub)
    }
    return domain.join(".");
};

DNSProxy.prototype.resolveDNSIp = function (msg) {
    if (msg.readUInt16LE(2) != 0x8081)
        return -1;

    var domain = [];
    var index = 12;
    var offset;
    while (offset = msg.readUInt8(index++)) {
        var sub = "";
        for (var i = 0; i < offset; i++) {
            sub += String.fromCharCode(msg.readUInt8(index++));
        }
        sub && domain.push(sub);
    }
    this._domain = domain.join(".");
    index += 4;
    while (msg.readUInt32BE(index + 2) != 0x00010001) {
        index += 10;
        var rdLength = msg.readUInt16BE(index);
        index += (rdLength + 2);

        if (index >= msg.length)
            return -1;
    }
    if (msg.readUInt16BE(index + 10) != 4)
        return -1;

    index += 12;
    this._ip = msg.readUInt8(index) + "." + msg.readUInt8(index + 1) + "." + msg.readUInt8(index + 2) + "." + msg.readUInt8(index + 3);
    return index;
};

DNSProxy.prototype.dot2num = function (dot) {
    var d = dot.split('.');
    return ((((((+d[0]) * 256) + (+d[1])) * 256) + (+d[2])) * 256) + (+d[3]);
};

DNSProxy.prototype.getMsg = function (tag, domain, ip) {
    var msg = {
        size : 0,
        msg : ""
    };
    var offset = 0;

    msg.size = 128;
    msg.msg = new Buffer(msg.size);
    msg.msg.writeUInt16BE(tag, offset);
    offset += 2;
    msg.msg.writeUInt16BE(0x8180, offset);
    offset += 2;
    msg.msg.writeUInt32BE(0x00010001, offset);
    offset += 4;
    msg.msg.writeUInt32BE(0x00000000, offset);
    offset += 4;

    // write domain
    var d = domain.split('.');
    for (var i = 0; i < d.length; i++) {
        var length = d[i].length;
        msg.msg.writeUInt8(length, offset++);
        msg.msg.write(d[i], offset, length);
        offset += length;
    }
    msg.msg.writeUInt8(0, offset++);

    msg.msg.writeUInt32BE(0x00010001, offset);
    offset += 4;
    msg.msg.writeUInt16BE(0xC00C, offset);
    offset += 2;
    msg.msg.writeUInt32BE(0x00010001, offset);
    offset += 4;
    msg.msg.writeUInt32BE(0x00000C82, offset);
    offset += 4;
    msg.msg.writeUInt16BE(0x0004, offset);
    offset += 2;
    msg.msg.writeUInt32BE(ip, offset);
    offset += 4;

    msg.size = offset;
    return msg;
};

DNSProxy.prototype.rewriteDomain = function (domain) {
    for ( var i in this._domainRewrite) {
        var dr = this._domainRewrite[i];
        if (dr.domain === domain) {
            return dr.address;
        }
    }
    return null;
};

DNSProxy.prototype.start = function () {
    var that = this;

    var socket = dgram.createSocket("udp4", function (msg, rinfo) {
        var domain = that.resolveDNSDomain(msg);
        var server = this;
        var address = rinfo.address;
        var port = rinfo.port;

        var rewriteAddress = that.rewriteDomain(domain);
        if (rewriteAddress !== null) {
            var tag = msg.readUInt16BE(0);
            var ip = that.dot2num(rewriteAddress);
            var newMsg = that.getMsg(tag, domain, ip);

            logger.info(domain + " rewrite to " + rewriteAddress);
            server.send(newMsg.msg, 0, newMsg.size, port, address);
            return;
        }

        logger.info("resolve domain " + domain);
        dgram.createSocket("udp4", function (msg, rinfo) {
            server.send(msg, 0, rinfo.size, port, address);
            this.close();
        }).send(msg, 0, rinfo.size, 53, that._upstreamServer);
    });

    socket.on("error", function (error) {
        logger.error(error);
    });

    socket.bind(53, this._address);

    logger.info("binding on " + this._address);
};

module.exports = DNSProxy;