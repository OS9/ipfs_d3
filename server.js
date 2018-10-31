var express = require("express");
var util = require("util");
var fs = require("fs");
var app = express();

function dump(v) {
    return console.log(util.inspect(v));
};

var f = require("./app.js");
var peer = require("./peer.js");
var stat = require("./bswstat.js");
var latest_version = fs.readFileSync("latest-version", "utf-8");
console.log(latest_version);
var path = "/ipfs/" + latest_version + "/viz"

var server = app.listen(3000, () => {
    console.log("Node.js is listening to PORT:" + server.address().port);
});

app.get(path, (req, res) => {
    // peer.app();
    // stat.app();
    f.app(req, res);
    // dump(global);
});
