import * as d3 from "d3-selection"
import "./plugin"

let main = d3.select("#main")

let data = Array.from({length: 11}).map((_, iconId) => ({iconId})).sort(_ => Math.random() > 0.5)

let style = {
    fill: "red",
    width: 40,
    height: 40
}

main
    .selectAll(".svg")
    .data(data)
    .enter()
    .append("svg")
    .createIcon(_ => _.iconId, style)


// test

// var matrix = [
//     [11975,  5871, 8916, 2868],
//     [ 1951, 10048, 2060, 6171],
//     [ 8010, 16145, 8090, 8045],
//     [ 1013,   990,  940, 6907]
// ];
//
// var tr = d3.select("body")
//     .append("table")
//     .selectAll("tr")
//     .data(matrix)
//     .enter().append("tr");
//
// console.log(tr)
//
// var td = tr.selectAll("td")
//     .data(function(d) { return d; })
//     .enter().append("td")
//     .text(function(d) { return d; });
//
// console.log(td)