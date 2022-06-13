import * as d3 from "d3";
import { loadMoviesDataset } from "./src/movies.js";
import {
  tfidf,
  inverseDocumentFrequency,
  documentToWords,
} from "./wordvector.js";
import { wordcloud } from "./wordcloud.js";
import {tagCloud} from "./tagcloud";

loadMoviesDataset().then((movies) => {
  let textcorpus = movies.map((d) => ({
    title: d.title,
    description: d.overview,
  }));

  // array of documents, each document is an array of single words
  let wordsPerDocument = textcorpus.map((document) =>
    documentToWords(document.description)
  );

  // calcuate tfidf scores for all single movie descriptions
  const idf = inverseDocumentFrequency(wordsPerDocument);
  const wordvectors = textcorpus.map((d, i) => ({
    title: d.title,
    description: d.description,
    wordvector: tfidf(wordsPerDocument[i], idf),
  }));
  console.log(wordvectors);
  tagCloud(d3.select("#dots"), wordvectors.slice(0, 10));

  // TODO: Task 3: calculate the tfidf scores for all genres
  const genres = Array.from(
    new Set(movies.map((movie) => movie.genres).flat())
  );


  // TODO: Task 3: replace the fakeData with your tfidf per genre
  const fakeData = new Map([["category 1", [["fake", 0.5], ["unfinished", 0.2], ["dataless", 0.1], ["artificial", 0.9]]]]);
  wordcloud({
    svg: d3.select("#wordcloud"),
    wordsPerGroup: fakeData,
    selection: d3.select("#genre"),
  });
  
});

