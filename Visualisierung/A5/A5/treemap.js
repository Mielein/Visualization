import * as d3 from "d3";
import { bigMoneyFormat, shortenText } from "./src/utils.js";

export function treemap({
  svg,
  data,
  width = 1000,
  height = 600,
  color = d3.scaleOrdinal(d3.schemeTableau10),
}) {
  svg.attr("viewBox", [0, 0, width, height]).style("font", "10px sans-serif");

  const tilings = [
    "treemapSquarify",
    "treemapBinary",
    "treemapSlice",
    "treemapDice",
    "treemapSliceDice",
  ];
  // setup the combobox for the selection of a tiling algorithm
  const selectTile = d3.select("select#treemapTile");
  selectTile
    .selectAll("option")
    .data(tilings)
    .join("option")
    .text((d) => d);

  // TODO: link the chart to the select element
  selectTile.on("click", function(e, d){
    console.log("click");
  })
  
  function update() {
    // remove all previous elements
    svg.selectAll("*").remove();

    // get the selected tiling algorithm string
    const tiling = selectTile.property("value");


    // TODO: prepare the treemap using d3.treemap and d3.hierarchy with the
    // selected tiling algorithm. 
    const hierarchy = d3
    .hierarchy(data)
    .sum((d) => d.revenue)
    .sort((a, b) => b.height - a.height || b.value - a.value);
    const root = d3.partition().size([height, width]).padding(1)(hierarchy);
    const maxDepth = d3.max(root.descendants(), (d) => d.depth);
    const x = d3
      .scaleBand()
      .domain(d3.range(1, maxDepth + 1))
      .range([0, width]);

    d3.treemap() 
      .size([width, height])
      .padding(1)
      (root)

    console.log(root.leaves())
    draw();

    // TODO: finish the draw function. You can take inspiration (and code) from 
    // the given icicles implementation for both the rectangles and the labels.
    // Please, do not forget the tooltips. 
    function draw() {
      // TODO: create a group for each leaf node#
      
      // TODO: draw a rectangle
      svg
        .selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
          .attr('x', (d) => d.x0)
          .attr('y', (d) => d.y0)
          .attr('width', (d) => d.x1 - d.x0)
          .attr('height', (d) => d.y1 - d.y0)
          .style("stroke", "black")
          .attr("fill", (d) => {
            if (!d.depth) return "#ccc";
            while (d.depth > 1) d = d.parent;
            return color(d.data.name);
          });
      // TODO: draw the label
      svg
        .selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
          .attr("x", (d) => d.x0)
          .attr("y", (d) => d.y0) 
          .text((d) => d.data.name)
          .attr("font-size", "15px")
          .attr("fill", "white")
    }
  }

  // naive function to heuristically determine font size based on the rectangle size
  function fontSize(d) {
    return Math.min(12, Math.max(8, d.x1 - d.x0 - 4));
  }

  // draw initially
  update();
}
