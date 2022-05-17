import * as d3 from "d3"

const data = await d3.csv("data/iris.csv", d3.autoType);
console.log(data);

const width = 800;
const height = width;
const margin = {top: 10, bottom: 50, right: 10, left: 50};
const padding = 20;

const parent = d3.select("#visualization");
const svg = parent.append("svg")
.attr("viewBox", [0,0,width,height]);

const crossProduct = d3.cross(data.columns, data.columns).filter(x => !x.includes("species"));

for(let i = 0; i < crossProduct.length; i++){
    scatterPlot(svg, data, crossProduct[i][0], crossProduct[i][1], "species", width, height, margin, i);

}



function scatterPlot(parent, data, x, y, colour, width, height, margin, i){

    

    const matrixWidth = (width - margin.left - margin.right - 3 * padding) / 4;
    const matrixHeight = (height - margin.top - margin.bottom - 3 * padding) / 4;

    

    const scaleX = d3.scaleLinear()
    .domain(d3.extent(data, d => d[x])) //extend() finds out highest or lowest value of array 
    .range([0, matrixWidth])
    .nice();

    const scaleY = d3.scaleLinear()
    .domain(d3.extent(data, d => d[y])) 
    .range([matrixHeight, 0])
    .nice();
    const scaleColour = d3.scaleOrdinal(d3.schemePaired); //do not have to define input domain

    if(i % 4 == 0){
        if(i == 0){
            parent.append("g") //groupelement
            .attr("transform", `translate(${i * (matrixWidth + padding)} , ${matrixHeight + padding})`)
            .call(d3.axisBottom(scaleX));

            parent.append("g") 
            .attr("transform", `translate(0, ${i * matrixHeight + padding})`)
            .call(d3.axisLeft(scaleY));
        }
        parent.append("g") //groupelement
        .attr("transform", `translate(${(i/4) * (matrixWidth + padding)} , ${i * matrixHeight + padding})`)
        .call(d3.axisBottom(scaleX));

        parent.append("g") 
        .attr("transform", `translate(${i/4 * (matrixHeight + padding)}, ${i * matrixHeight + padding})`)
        .call(d3.axisLeft(scaleY));
    }
    else{
        parent.append("g") //groupelement
        .attr("transform", `translate(${i * (matrixWidth + padding)} , ${matrixHeight + padding})`)
        .call(d3.axisBottom(scaleX));

        parent.append("g") 
        .attr("transform", `translate(${i * (matrixWidth + padding)}, ${matrixHeight + 15})`)
        .call(d3.axisLeft(scaleY));
    }

    parent.selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => scaleX(d[x])) //central x
    .attr("cy", d => scaleY(d[y])) //central y
    .attr("r", 5) //radius
    .attr("fill", d => scaleColour(d[colour]));

    const brush = d3.brush()
    .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]]) //upper left corner and bottom right corner
    .on("start brush end", brushed);

    parent.call(brush);

    function brushed({selection}, data){
        console.log(selection, data);
        if(selection && selection[0] && selection[1]){
            console.log("x", scaleX.invert(selection[0][0]),scaleX.invert(selection[1][0]))
            console.log("y", scaleY.invert(selection[0][1]),scaleY.invert(selection[1][1]))
        }
    }
}