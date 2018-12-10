var m = [20, 120, 20, 120],
w = 1280 - m[1] - m[3],
h = 800 - m[0] - m[2],
i = 0,
root;

var tree = d3.layout.tree()
.size([h, w]);

var diagonal = d3.svg.diagonal()
.projection(function(d) { return [d.y, d.x]; });

var vis = d3.select("#body").append("svg:svg")
.attr("width", w + m[1] + m[3])
.attr("height", h + m[0] + m[2])
.append("svg:g")
.attr("transform", "translate(" + m[3] + "," + m[0] + ")");

function toggleAll(d) {
  if (d.children) {
    d.children.forEach(toggleAll);
    toggle(d);
  }
}

function update(source) {
  var duration = d3.event && d3.event.altKey ? 5000 : 500;

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse();

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Update the nodes…
  var node = vis.selectAll("g.node")
  .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("svg:g")
  .attr("class", "node")
  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
  .on("click", function(d) { toggle(d); update(d); });

  nodeEnter.append("svg:circle")
  .attr("r", 1e-6)
  // .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("svg:text")
  .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
  .attr("dy", ".35em")
  .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
  .text(function(d) { return d.Name; })
  .style("fill-opacity", 1e-6);

  // for (let index = 0; index < vis.selectAll("g.node").length; index++) {
  //   const element = vis.selectAll("g.node")[index];
  //   for (let index = 0; index < element.length; index++) {
  //     const visobj = element[index].textContent;
  //     if (splitExt(visobj)[1]==".js") {
        
  //       console.count("jsfile");
  //     }else {
  //       button();
  //     }
  //   }
  // }

  nodeEnter.append('image')
  .attr('class', 'menu')
  .attr('xlink:href', 'http://free-icon-rainbow.com/i/icon_02646/icon_026460.svg')
  .attr('x', '-15px')
  .attr('y', '-47px')
  .attr('width', '30px')
  .attr('height', '30px')
  .on('click', function (d,idx) {
    alert("Name: "+d.Name+"\n Hash: "+d.Hash);
    d3.event.stopPropagation();
  });

  // nodeEnter.append('image')
  // .attr('class', 'menu')
  // .attr('xlink:href', function() { return 'https://cdn3.iconfinder.com/data/icons/users/100/user_male_1-512.png';})
  // .attr('x', '0px')
  // .attr('y', '-47px')
  // .attr('width', '30px')
  // .attr('height', '30px')
  // .on('click', function (d,idx) {
  //   alert("Name: "+d.Name+"\n Hash: "+d.Hash);
  //   var s = d3.select(this);
  //   var DOMp = s.node().parentNode;
  //   var p2 = d3.select(DOMp);
  //   p2.append('g')
  //     .append('rect')
  //     .attr('x', '20')
  //     .attr('y', '-8')
  //     .attr('width', '100')
  //     .attr('height', '30')
  //     .attr('fill', 'blue')
  //     .attr('stroke', 'black')
  //     .attr('stroke-width', '1');
  //   d3.event.stopPropagation();     
  // });

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
  .duration(duration)
  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
  .attr("r", 4.5)
  .style("fill", function(d) { 
    if(d._children) {
      return "lightsteelblue";
    }else if(splitExt(d.Name)[1]==".js") {
      return "#f00";
    }else {
      return "#fff";
    }
    // return d._children ? "lightsteelblue" /*: splitExt(d.Name)[1]==".js" ? "red" */: "#fff"; 
  });

  nodeUpdate.select("text")
  .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
  .duration(duration)
  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
  .remove();

  nodeExit.select("circle")
  .attr("r", 1e-6);

  nodeExit.select("text")
  .style("fill-opacity", 1e-6);

  // Update the links…
  var link = vis.selectAll("path.link")
  .data(tree.links(nodes), function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("svg:path", "g")
  .attr("class", "link")
  .attr("d", function(d) {
    var o = {x: source.x0, y: source.y0};
    return diagonal({source: o, target: o});
  })
  .transition()
  .duration(duration)
  .attr("d", diagonal);

  // Transition links to their new position.
  link.transition()
  .duration(duration)
  .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
  .duration(duration)
  .attr("d", function(d) {
    var o = {x: source.x, y: source.y};
    return diagonal({source: o, target: o});
  })
  .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children.
function toggle(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
}

function splitExt(filename) {
  return filename.split(/(?=\.[^.]+$)/);
}