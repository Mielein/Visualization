import * as d3 from "d3"
import { color, selection } from "d3";

const data = await d3.csv("data/iris.csv", d3.autoType);
data.forEach((d, i) => d.index = i);

const width = 800;
const height = width;
const margin = {top: 10, bottom: 50, right: 10, left: 50};
const padding = 20;

const parent = d3.select("#visualization");
const svg = parent.append("svg")
.attr("viewBox", [-30,0,width,height]);

const x = data.columns.filter(x => !x.includes("species"));;
const y = data.columns.filter(x => !x.includes("species"));;


scatterPlot(svg, data, x, y, {species: d => d.species}, width, height, margin);
//parallelCoordinate(parent, data, x, y, width, height, margin);


function scatterPlot(parent, data, x, y, {species = () => 1}, width, height, margin){
    const X = d3.map(x, x => d3.map(data, typeof x === "function" ? x : d => d[x]));
    const Y = d3.map(y, y => d3.map(data, typeof y === "function" ? y : d => d[y]));
    const S = d3.map(data, species);

    const matrixWidth = (width - margin.left - margin.right - (X.length - 1) * padding) / X.length;
    const matrixHeight = (height - margin.top - margin.bottom - (Y.length - 1) * padding) / Y.length;

    const scaleColour = d3.schemePaired;

    const scaleX = X.map(X => d3.scaleLinear(d3.extent(X), [0, matrixWidth]));
    const scaleY = Y.map(Y => d3.scaleLinear(d3.extent(Y), [matrixHeight, 0]));
    const scaleS = d3.scaleOrdinal(S, scaleColour);

    const axisX = d3.axisBottom().ticks(6);
    const axisY = d3.axisLeft().ticks(6);
    
    parent.append("g") //groupelement
    .selectAll("g")
    .data(scaleX)
    .join("g")
    .attr("transform", (d, i) => `translate(${i * (matrixWidth + padding)},${height - margin.bottom - margin.top})`)
    .each(function(scaleX) { return d3.select(this).call(axisX.scale(scaleX)); });

    parent.append("g") 
    .selectAll("g")
    .data(scaleY)
    .join("g")
    .attr("transform", (d, i) => `translate(0,${i * (matrixHeight + padding)})`)
    .each(function(scaleY) { return d3.select(this).call(axisY.scale(scaleY)); });

    const matrix = parent.append("g")
    .selectAll("g")
    .data(d3.cross(d3.range(X.length), d3.range(Y.length)))
    .join("g")
    .attr("transform", ([i, j]) => `translate(${i * (matrixWidth + padding)},${j * (matrixHeight + padding)})`);

    matrix.append("rect")
    .attr("fill", "none")
    .attr("stroke", "currentColor")
    .attr("width", matrixWidth)
    .attr("height", matrixHeight)

    console.log(d => scaleColour(d.species));
    matrix.each(function([x,y]) {
        d3.select(this).selectAll("circle")
        .data(d3.range(S.length))
        .join("circle")
        .attr("cx", i => scaleX[x](X[x][i])) //central x
        .attr("cy", i => scaleX[y](Y[y][i])) //central y

    });

    const circle = matrix.selectAll("circle")
    .attr("r", 2) //radius
    .attr("fill", i => scaleS(S[i]));

    parent.append("g")
    .attr("font-size", 10)
    .selectAll("text")
    .data(x)
    .join("text")
    .attr("transform", (d, i) => `translate(${i * (matrixWidth + padding)},${i * (matrixHeight + padding)})`)
    .attr("x", padding / 2)
    .attr("y", padding / 2)
    .attr("fill", "black")
    .attr("dy", ".3em") 
    .text(d => d);

    const brush = d3.brush()
    .extent([[ 0, 0], [matrixWidth, matrixHeight]]) //upper left corner and bottom right corner
    .on("start", brushBeginn)
    .on("brush", brushed)
    .on("end", brushEnded );

    matrix.call(brush);

    let brushMatrix;

    function brushBeginn() {
        if(brushMatrix !== this) {
            d3.select(brushMatrix).call(brush.move, null);
            brushMatrix = this;
        }
    }
        
    function brushed({selection}, [i,j]){
        let selected = []
        /* if(selection && selection[0] && selection[1]){
            console.log("x", scaleX.invert(selection[0][0]),scaleX.invert(selection[1][0]))
            console.log("y", scaleY.invert(selection[0][1]),scaleY.invert(selection[1][1]))
        } */
        parent.property("value", selected).dispatch("input");

    }    
    function brushEnded({selection}) {
        if(selection) return;
        parent.property("value", []).dispatch("input");
        circle.classed("hidden", false);
    }   
}
//parse error :(
/* function parallelCoordinate(parent, data, x, y, width, height, margin) {

    const S = d3.map(data, d => d.species);
    const color = d3.scaleOrdinal(S, d3.schemeAccent);

    var Y = {}
    for(var i in x) {
        var title = x[i];
        Y[title] = d3.scaleLinear()
        .domain([0, y])
        .range([2 * height - margin.top - padding, height + margin.bottom]);
    }

    var X = d3.scalePoint()
        .domain(x)
        .range([margin.right + padding, width - margin.left - padding]);

    parent.selectAll("myPath")
    .data(data)
    .enter()
    .append("path")
        .attr("class", d => "line" + d.species)
        .attr("d", d => d3.line()(x.map(p => [X(p), Y[p](d[p])])))
        .style("fill", "none")
        .style("stroke", d => color(d.species))
        .style("opacity", 0.8)

    parent.selectAll("myAxis")
    .data(x).enter()
    .append("g")
    .attr("class", "axis")
    .attr("transform", d => translate(${X(d)})
    .each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(Y[d])); })
    .append("text")
        .attr("y", height + margin.top + padding)
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text(d => d)
} */

//used 
//https://observablehq.com/@d3/brushable-scatterplot-matrix
//https://observablehq.com/@d3/splom
//https://d3-graph-gallery.com/graph/parallel_custom.html
//also got help from Lisa Piekarski and Jeremias Kilian


