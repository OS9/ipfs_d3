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
var d3_tree = require("./lib/d3/d3_tree.js");
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

    (async _ => {
        const res = await fetch(refs);
        const text = await res.text();
        console.log(text);
        var data, tree, lines, line, datum, ref, src, dst, ref, children;
        data = text;
        tree = {};
        lines = data.split("\n");
        for(let i = 0, len = lines.length; i < len; i++) {
            line = lines[i];
            if(!line.trim()) {
                continue;
            }
            datum = JSON.parse(line);
            ref = datum.Ref.split(' '), src = ref[0], dst = ref[1], linkname = ref[2];
            if(src && dst && linkname) {
                if (tree[src] == null) {
                    tree[src] = [];
                }
                tree[src].push({
                    Hash: dst,
                    Name: linkname
                });
            }
            // console.log(linkname);
        }
        children = getDecendants(hash, tree);
        d3_tree.root = {
            children: child
        };
        d3_tree.root.x0 = h / 2;
        d3_tree.root.y0 = 0;
        d3_tree.root.children.forEach(toggleAll);
        return d3_tree.update(d3_tree.root);
    })();

};

getDecendants = (ref, dict) => {
    var child, children, decendants, i, len;
    if (!((ref != null) && (dict != null))) {
        throw new Error;
    }
    children = dict[ref];
    if (children != null) {
        for (i = 0, len = children.length; i < len; i++) {
            child = children[i];
            if (child.Hash == null) {
                throw new Error;
            }
            decendants = getDecendants(child.Hash, dict);
            if (decendants != null) {
                child.children = decendants;
            }
        }
        return children;
    }
};