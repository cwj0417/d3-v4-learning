import * as d3_select from "d3-selection"
import * as d3_scale from "d3-scale"
import * as d3_brush from "d3-brush"

import data from "./timeline"

if (data.length === 0) {
    throw new Error("invalid data")
}

const d3 = Object.assign({}, d3_select, d3_scale, d3_brush)

function dateformat (ts) {
    let date = new Date(ts)
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

// import separator

const width = 1200
const height = 300
const scaleHeight = data.length
const [scaleWidthMin, scaleWidthMax] = data.reduce(([min, max], {events}) => {
    min = Math.min(min, events.reduce((min, {eventTime}) => Math.min(min, eventTime), events[0].eventTime))
    max = Math.max(max, events.reduce((max, {eventTime}) => Math.max(max, eventTime), events[0].eventTime))
    return [min, max]
}, [data[0].events[0].eventTime, data[0].events[0].eventTime])

let realData = []
for (let index = 0; index < data.length; index++) {
    realData = realData.concat(data[index].events.map(_ => {
        _.alertOrder = index
        return _
    }))
}

// const separator

const sx = d3.scaleLinear()
    .domain([scaleWidthMin, scaleWidthMax])
    .range([0, width])

const sy = d3.scaleLinear()
    .domain([0, data.length])
    .range([0, height])

// scale separator

// start draw

const lanHeight = 50

let landscape = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", lanHeight)
    .attr("class", "landscape")
    .append("g")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "g")

let main = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "svg")
    .append("g")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "g")

// draw title

main
    .append("g")
    .attr("class", "main-line-title")
    .selectAll(".lines")
    .data([0, 1, 2, 3, 4, 5, 6, 7])
    .enter().append("text")
    .text(_ => dateformat(sx.invert(_)))
    .attr("x", _ => sx(scaleWidthMin + (_ / 8 * (scaleWidthMax - scaleWidthMin))))
    .attr("y", 0)

// draw line

main
    .append("g")
    .attr("class", "main-line-g")
    .selectAll(".lines")
    .data(realData)
    .enter().append("line")
    .attr("x1", _ => sx(_.eventTime))
    .attr("x2", _ => sx(_.eventTime))
    .attr("y1", _ => sy(_.alertOrder))
    .attr("y2", _ => sy(_.alertOrder + 1))

// make brush

let mainSelection
let landScapeSelection
let movingBrush = false
let movingBrushL = false

let brush = d3.brush()
    .on("start", _ => movingBrush = true)
    .on("brush", brushHandle)
    .on("end", _ => movingBrush = false)

let brushL = d3.brushX()
    .on("start", _ => movingBrushL = true)
    .on("brush", brushHandleL)
    .on("end", _ => movingBrushL = false)

let brushG = main
    .append("g")
    .call(brush)
brushG.select(".handle--n").remove()
brushG.select(".handle--e").remove()
brushG.select(".handle--s").remove()
brushG.select(".handle--w").remove()
brushG.select(".handle--nw").remove()
brushG.select(".handle--ne").remove()
brushG.select(".handle--se").remove()
brushG.select(".handle--sw").remove()

brush.move(brushG, [[0, 0], [100, 150]])

let brushLG = landscape
    .append("g")
    .attr("class", "landscapeBrush")
    .call(brushL)

brushL.move(brushLG, [0, 100])

function brushHandle (target, type, selection) {
    mainSelection = d3.brushSelection(selection[0])
    if (brushLG && !movingBrushL) {
        brushL.move(brushLG, [mainSelection[0][0], mainSelection[1][0]])
    }
    display()
}

function brushHandleL(target, type, selection) {
    landScapeSelection = d3.brushSelection(selection[0])
    if (!movingBrush) {
        brush.move(brushG, [[landScapeSelection[0], mainSelection[0][1]], [landScapeSelection[1], mainSelection[1][1]]])
    }
    display()
}

function display () {
    console.log(mainSelection)
    console.log("告警:")
    console.log(Math.round(sy.invert(mainSelection[0][1])), Math.round(sy.invert(mainSelection[1][1])))
    console.log("时间:")
    console.log(sx.invert(mainSelection[0][0]), sx.invert(mainSelection[1][0]))
}