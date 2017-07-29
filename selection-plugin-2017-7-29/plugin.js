import * as d3 from "d3-selection"

import config from "./svgPath"

d3.selection.prototype.createIcon = function (fn, style = {}) {
    this.each(function (...params) {
        let id = typeof fn === "function" ? fn(...params) : "0"
        let svg = d3.select(this)
        for (let [key, value] of Object.entries(style)) {
            svg.attr(key, value)
        }
        svg.call(drawIcon, config[id].path)
    })
    return this
}

function drawIcon (svg, paths) {
    svg.attr("viewBox", "0 0 128 128")
    let g = svg.append("g")
        .attr("transform", "translate(0, 128) scale(0.1, -0.1)")
    for (let each of paths) {
        g.append("path")
            .attr("d", each)
    }
}