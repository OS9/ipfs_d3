const d3 = require('d3')
const { JSDOM } = require('jsdom')

const document = new JSDOM().window.document
const svg = d3.select(document.body).append('svg')

// この表記は使えない
//svg.attr({'width':300, 'height':480})
svg.attr('width', 200)
svg.attr('height', 200)

// svgに円(circle)を追加
// 中心のx座標(cx):100,中心のy座標(cy):90,半径(r):20
// svg.append('circle')
//  .attr('cx', 100)
//  .attr('cy', 90)
//  .attr('r', 20)
const c1 = [50, 50, 30]
const c2 = [100, 100, 20]

const color = d3.scaleOrdinal(d3.schemeCategory10)

const g = svg.selectAll("g").data([c1, c2]).enter()
    .append("g")
    .attr("transform", d => `translate(${d[0]}, ${d[1]})`)

// .attr("cx", function(d) { return d[0] })
// .attr("cy", function(d) { return d[1] })

g.append("circle")
    .attr("r", d => d[2])
    .attr("fill", (d, i) => color(i))

g.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .attr("fill", "white")
    .text((d, i) => i + 1)

console.log(document.body.innerHTML)