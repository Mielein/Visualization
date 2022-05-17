import * as d3 from "d3"

const data = await d3.csv("data/iris.csv", d3.autoType);
console.log(data);

const width = 800;
const height = width;
const margin = {top: 10, bottom: 50, right: 10, left: 50};

const parent = d3.select("#visualization");
const svg = parent.append("svg")
.attr("viewBox", [0,0,width,height]);

const x = data.columns;
const y = data.columns;


scatterPlotMatrix(svg, data, x, y, "species", width, height, margin);


function scatterPlotMatrix(parent, data, x, y, colour, width, height, margin){
    const X = d3.map(x, x => d3.map(data, typeof x == "function" ? x : d => d[x]));
    const Y = d3.map(y, y => d3.map(data, typeof y == "function" ? x : d => d[y]));

    const cellWidth = (width - margin.left -margin.right)/x.length;
    const cellHeight = (height - margin.top -margin.bottom)/y.length;

    const scaleX = d3.scaleLinear()
    .domain(d3.extent(data, d => d[x])) //extend() finds out highest or lowest value of array 
    .range([margin.left, width - margin.right])
    .nice();
    const scaleY = d3.scaleLinear()
    .domain(d3.extent(data, d => d[y])) 
    .range([height - margin.bottom, margin.top])
    .nice();
    const scaleColour = d3.scaleOrdinal(d3.schemePaired); //do not have to define input domain

    const xAxis = d3.axisBottom().ticks(cellWidth/50);
    const yAxis = d3.axisBottom().ticks(cellHeight/35);

    parent.append("g") //groupelement
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(scaleX));

    parent.append("g") 
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(scaleY));

    parent.selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => scaleX(d[x])) //central x
    .attr("cy", d => scaleY(d[y])) //central y
    .attr("r", 5) //radius
    .attr("fill", d => scaleColour(d[colour]));

    const cell = parent.append("g")
    .selectAll("g")
    .data(d3.cross(x,y))
    .join("g")
        .attr("transform", ([i,j]) => `translate(${i * (cellWidth)}, ${j * (cellHeight)})`);

    cell.append("rect")
        .attr("fill","none")
        .attr("stroke", "currentColor")
        


    cell.each(function([x,y]){
        d3.select(this).selectAll("circle")
        .join("circle")
            .attr("r", 3.5)
            .attr("cx", i => xScales[x](X[x][i]))
            .attr("cy", i => yScales[y](Y[y][i]))

    });

    const brush = d3.brush()
    .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]]) //upper left corner and bottom right corner
    .on("start brush end", brushed);

    parent.call(brush);

    function brushed({selection}, data){
        console.log(selection, data);
        console.log("x", scaleX.invert(selection[0][0]),scaleX.invert(selection[1][0]))
        console.log("y", scaleY.invert(selection[0][1]),scaleY.invert(selection[1][1]))
    }
  


}