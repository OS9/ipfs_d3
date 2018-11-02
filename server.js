var express = require("express");
var util = require("util");
var fs = require("fs");
var d3 = require("d3");
global.fetch = require("node-fetch");
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var app = express();
// var xhr = new XMLHttpRequest();

function dump(v) {
    return console.log(util.inspect(v));
};

// var f = require("./app.js");
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
    render(WATCH_HASH);
    // res.send('<a href="/test">test</a>');
});

// app.use(express.static("."));

app.get("/test", (req, res) => {
    // res.redirect(path);
    // res.redirect("http://google.com");
});

render = (hash) => {
    var refs, ipfs;
    refs = "http://localhost:5001/api/v0/refs?arg=" + hash + "&recursive&format=" + encodeURIComponent('<src> <dst> <linkname>');
    console.log(refs);
    // ipfs = stat.app();
    // fetch(refs).then(res => res.text()).then(text => console.log(text));
    return d3.text(refs, (err, text) => {
        console.log("1");
        var data;
        data = text.responseText;
        // console.log(data);
    });
};