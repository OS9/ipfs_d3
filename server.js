var express = require("express");
var util = require("util");
var fs = require("fs");
var d3 = require("d3");
var app = express();

function dump(v) {
    return console.log(util.inspect(v));
};

var f = require("./app.js");
var peer = require("./peer.js");
var stat = require("./bswstat.js");
var latest_version = fs.readFileSync("latest-version", "utf-8");
console.log(latest_version);
latest_version = latest_version.replace(/\r?\n/g,"");

var WATCH_HASH = 'QmX5smVTZfF8p1VC8Y3VtjGqjvDVPWvyBk24JgvnMwHtjC';
var path = "http://localhost:8080/ipfs/" + latest_version + "/viz#" + WATCH_HASH;
console.log(path);

var server = app.listen(3000, () => {
    console.log("Node.js is listening to PORT:" + server.address().port);
});

app.get("/", (req, res) => {
    // peer.app();
    // stat.app();
    // f.app(req, res);
    // dump(global);
    render();
    res.send('<a href="/test">test</a>');
});

app.get("/test", (req, res) => {
    // res.redirect(path);
    res.redirect("http://google.com");
});


render = () => {
    var ipfs = stat.app();
    return d3.xhr(ipfs, (err, data) => {
        data = xhr.responseText;
        
        console.log(data);
    });
};