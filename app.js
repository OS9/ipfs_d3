var API_REFS_FORMAT, DEBUG, DEMO_HASH, app, d, debug, getDecendants, render,
  slice = [].slice;

DEMO_HASH = 'QmX5smVTZfF8p1VC8Y3VtjGqjvDVPWvyBk24JgvnMwHtjC';

DEBUG = true;

API_REFS_FORMAT = encodeURIComponent('<src> <dst> <linkname>');

var url = require("url");

exports.app = function(req, res) {
  var hash;
  hash = req.url;
  return console.log(hash);
  // hash = global.location.hash.slice(1);
  // console.log(hash);
  // if (hash.length > 0) {
  //   return render(hash);
  // } else {
  //   global.location.hash = '#' + DEMO_HASH;
  //   return global.location.reload();
  // }
};

render = function(hash) {
  var blockStat, dagget, get, objdata, objlinks, objstat, refs, test;
  refs = "/api/v0/refs?arg=" + hash + "&recursive&format=" + API_REFS_FORMAT;
  blockStat = "/api/v0/block/stat?arg=" + hash;
  get = "/api/v0/block/get?arg=" + hash;
  objdata = "/api/v0/object/data?arg=" + hash;
  objlinks = "/api/v0/object/links?arg=" + hash;
  objstat = "/api/v0/object/stat?arg=" + hash;
  dagget = "/api/v0/dag/get?arg=" + hash;
  // test = "/api/v0/";
  // d3.xhr(test, function(error, xhr) {
  //   console.log("test");
  //   test = xhr.responseText;
  //   console.log(test);
  //   return console.log("------------------------");
  // });
  return d3.xhr(refs, function(error, xhr) {
    var children, data, datum, dst, i, len, line, lines, linkname, ref1, src, tree;
    data = xhr.responseText;
    tree = {};
    lines = data.split("\n");
    for (i = 0, len = lines.length; i < len; i++) {
      line = lines[i];
      if (!line.trim()) {
        continue;
      }
      datum = JSON.parse(line);
      ref1 = datum.Ref.split(' '), src = ref1[0], dst = ref1[1], linkname = ref1[2];
      if (src && dst && linkname) {
        if (tree[src] == null) {
          tree[src] = [];
        }
        tree[src].push({
          Hash: dst,
          Name: linkname
        });
      }
    }
    children = getDecendants(hash, tree);
    this.root = {
      children: children
    };
    this.root.x0 = h / 2;
    this.root.y0 = 0;
    this.root.children.forEach(toggleAll);
    return update(this.root);
  });
};

getDecendants = function(ref, dict) {
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

d = debug = function() {
  var args;
  args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
  if (DEBUG) {
    return console.debug.apply(console, args);
  }
};

// app();

// var API_REFS_FORMAT, DEBUG, DEMO_HASH, app, d, debug, getDecendants, render, slice = [].slice;

// DEMO_HASH = "QmX5smVTZfF8p1VC8Y3VtjGqjvDVPWvyBk24JgvnMwHtjC";

// DEBUG = true;

// API_REFS_FORMAT = encodeURIComponent("<src> <dst> <linkname>");

// app = () => {
//     var hash;
//     hash = global.location.hash.slice(1);
//     if(hash.length > 0) {
//         return render(hash);
//     }else {
//         global.location.hash = "#" + DEMO_HASH;
//         return global.location.reload();
//     }
// };

// render = (hash) => {
//     var blockStat, dagget, get, objdata, objlinks, objstat, refs, test;
//     refs = "/api/v0/refs?arg=" + hash + "&recursive&format=" + API_REFS_FORMAT;
//     return d3.xhr(refs, function(error, xhr) {
//         var children, data, datum, dst, i, len, line, lines, linkname, ref1, src, tree;
//         data = xhr.responseText;
//         tree = {};
//         lines = data.split("\n");
//         for (i = 0, len = lines.length; i < len; i++) {
//             line = lines[i];
//             if (!line.trim()) {
//                 continue;
//             }
//             datum = JSON.parse(line);
//             ref1 = datum.Ref.split(' '), src = ref1[0], dst = ref1[1], linkname = ref1[2];
//             if (src && dst && linkname) {
//                 if (tree[src] == null) {
//                     tree[src] = [];
//                 }
//                 tree[src].push({
//                     Hash: dst,
//                     Name: linkname
//                 });
//             }
//         }
//         children = getDecendants(hash, tree);
//         this.root = {
//             children: children
//         };
//         this.root.x0 = h / 2;
//         this.root.y0 = 0;
//         this.root.children.forEach(toggleAll);
//         return update(this.root);
//     });    
// };

// getDecendants = (ref, dict) => {
//     var child, children, decendants, i, len;
//     if (!((ref != null) && (dict != null))) {
//         throw new Error;
//     }
//     children = dict[ref];
//     if (children != null) {
//         for (i = 0, len = children.length; i < len; i++) {
//             child = children[i];
//             if (child.Hash == null) {
//                 throw new Error;
//             }
//             decendants = getDecendants(child.Hash, dict);
//             if (decendants != null) {
//                 child.children = decendants;
//             }
//         }
//         return children;
//     }
// };

// d = debug = function() {
//     var args;
//     args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
//     if (DEBUG) {
//         return console.debug.apply(console, args);
//     }
// };
  
// app();