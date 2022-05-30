import * as d3 from "d3";
import { axisBottom } from "d3";
import { bigMoneyFormat, shortenText } from "./src/utils.js";

export function lineChart({
  svg,
  data,
  attribute,
  width = 1000,
  height = 500,
  margin = { top: 20, right: 120, bottom: 30, left: 40 },
}) {
  svg.attr("viewBox", [0, 0, width, height]).style("font", "10px sans-serif");

  // scale for the number of days on the x-axis
  const x = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.day))
    .range([margin.left, width - margin.right])
    .clamp(true);

  const y = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d[attribute]))
    .range([height - margin.bottom, margin.top])
    .nice();

  // group the data by movie title
  const movies = d3
    .groups(data, (d) => d.title) //group data by key => title
    .map(([key, values]) => ({ key, values }));

  //console.log(movies[1].values[2].day);

  // draw the x-axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(width / 80)
        .tickSizeOuter(0)
    );

  // draw the y-axis with grid lines
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickFormat(bigMoneyFormat))
    .call((g) =>
      g
        .selectAll(".tick line")
        .clone()
        .attr("stroke-opacity", (d) => (d === 1 ? null : 0.2))
        .attr("x2", width - margin.left - margin.right)
    );

  // color scale by movie title
  const color = d3.scaleOrdinal(d3.schemeCategory10).domain(movies.keys());

  // TODO: draw a line for each time series as well as labels
    const line = d3.line()
      .x((d) => x(d.day)/* movies[d].values[d].day */)
      .y((d) => y(d.totalGross)/* movies[d].values[d].totalGross */);

    
  svg.selectAll(".line")
    .data(movies)
    .append("path")
    .attr("fill", "none")
    .attr("stroke", color) 
    .attr("stroke-width", 1.5)
    .attr("d", line)
}
