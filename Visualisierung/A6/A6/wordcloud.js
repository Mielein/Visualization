import * as d3 from "d3";
import cloud from "d3-cloud";
/* Function to draw a word cloud
 * svg: d3 selection of an svg element
 * wordsPerGenre: Map of form {group =>  [[word, frequency], [word, frequency], ...], ...}
 * selection: d3 selection of select element
 */
export function wordcloud({ svg, wordsPerGroup, selection }) {
  const width = 600;
  const height = 200;
  svg.attr("viewBox", [0, 0, width, height]);

  // group element, translated such that the origin is in the middle of the svg
  const g = svg
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // word size scale, you can play around with the range if you like
  const size = d3.scaleLinear().range([10, 50]);

  // fill the select box with the options from the wordsPerGroup
  selection
    .selectAll("option")
    .data(Array.from(wordsPerGroup.keys()))
    .join("option")
    .text((d) => d);

  // TODO: Task 1: create the layout of the word cloud with 
  // d3-cloud. The function you need has been imported for you 
  // as "cloud()". Note, that the actual words will be 
  // determined in the "update()"-function below. 
  const layout = cloud()
    .size([height, width])
    .rotate(0)
    .padding(d => d.padding)
    .fontSize(d => Math.sqrt(d[1]) * 20)
    .font(d => d.font);
 
  update();
  selection.on("change", update);
  function update() {
    // get the option of the select box
    const group = selection.property("value");
    // get the 100 most frequent words of the selected group
    const words = wordsPerGroup.get(group).slice(0, 100);
    
    //adjust the domain of the word size scale
    size.domain(d3.extent(words, (d) => d[1]));
    // TODO: Task 1: adjust the layout accordingly
    layout
    .words(words)
    .on("word", () => {
      g.append("text")
        .attr("transform", `translate(${words.x},${words.y}) rotate(${words.rotate})`)
          .text(words.map(d => d[0]));})
    .start();
  }
}
