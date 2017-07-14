import * as d3 from "d3-selection"

let data = [1, 2, 3, 4, 5]

const ul = d3.select("#test")

function update () {
    console.log("updated")
    data = data.map(_ => ++_)
    let lis = ul.selectAll("li")
        .data(data)
    lis
        .enter().append("li")
        .merge(lis)
        .html(d => d)
    lis
        .exit().remove()
}

update()

setInterval(update, 1000)