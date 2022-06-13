import * as d3 from "d3";
import { treemapSquarify } from "d3";
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
  selectTile.on("change", function(d){
      
    console.log(d);
    update()
  })

  console.log(tilings.values == "treemapSquarify")
  
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
    const root = d3.partition().size([height, width]).padding(1)(hierarchy);
    const maxDepth = d3.max(root.descendants(), (d) => d.depth);
    const x = d3
      .scaleBand()
      .domain(d3.range(1, maxDepth + 1))
      .range([0, width]);

    d3.treemap() 
      .tile(d3[tiling])
      .size([width, height])
      .padding(2)
      (root)

    console.log(root)
    console.log(root.leaves())
    draw();

    function draw() {
      // TODO: create a group for each leaf node#
      const node = svg.selectAll("a")
      .data(root.leaves())
      .join("a")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);
      
      // TODO: draw a rectangle
       node.append("rect")
       .attr('width', (d) => d.x1 - d.x0)
       .attr('height', (d) => d.y1 - d.y0)
       .style("stroke", "black")
       .attr("fill", (d) => {
         if (!d.depth) return "#ccc";
         while (d.depth > 1) d = d.parent;
         return color(d.data.name);
       });

      // TODO: draw the label
        const text = node.append("text")
        .attr("font-size", fontSize)
        .attr("x", 0)   
        .attr("y", 10) 
        .text((d) =>
          shortenText(
            d.children ? d.data.name : d.data.title,
            Math.floor( (d.x1 - d.x0) / fontSize(d)* 1.4))
        );
        text
          .append("tspan")
          .attr("x", 0)   
          .attr("y", 20)
          .attr("fill-opacity", 0.7)
          .text((d) =>`${bigMoneyFormat(d.value)}`);

    } 
  }
  const minFontSize = 6;
  // naive function to heuristically determine font size based on the rectangle size
  function fontSize(d) {
    return Math.min(10, Math.max(8, d.x1 - d.x0 - 4));
  }

  // draw initially
  update();
}
