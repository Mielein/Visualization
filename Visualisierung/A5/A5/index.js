import * as d3 from "d3";
import { lineChart } from "./linechart.js";
import { loadMoviesDataset } from "./src/movies.js";
import { movieFranchises } from "./src/franchises.js";
import { icicle } from "./src/icicle.js";
import { treemap } from "./treemap.js";

const width = 1000;

d3.csv("/data/boxoffice.csv", d3.autoType).then((data) => {
  const attribute = "totalGross";
  lineChart({
    svg: d3.select("svg#linechart"),
    width: width,
    data: data,
    attribute: attribute,
  });
});

loadMoviesDataset().then((movies) => {
  const franchises = movieFranchises(movies);
  //console.log(franchises);
  const color = d3
    .scaleOrdinal(d3.schemeTableau10)
    .domain(new Set(franchises.children, (d) => d.data.name));

  icicle({
    svg: d3.select("svg#icicle"),
    data: franchises,
    color: color,
  });
  treemap({
    svg: d3.select("svg#treemap"),
    data: franchises,
    color: color,
  });
});
