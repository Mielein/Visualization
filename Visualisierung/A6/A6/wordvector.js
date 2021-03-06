import { stopwords } from "./stopwords";
import * as d3 from "d3";

export function documentToWords(text) {
  return (
    text
      .replace(/\W/g, " ")
      .split(" ")
      // transform to lower case
      .map((word) => word.toLowerCase())
      // filter stopwords
      .filter((word) => !stopwords.includes(word) && word.length > 0)
  );
}
//TODO: Task 2: implement the inverse document frequency
// wordsPerDocument: array of documents, which are arrays of single words => [[word, word, ...], [word, word, ...], ...]
// RETURN: Map of words matching their idf score
export function inverseDocumentFrequency(wordsPerDocument) {
  const idf = new Map(); 

  var counter = 0;
  for (let i = 0; i < wordsPerDocument.length; i++){
    counter = 0;
    for(let j = 0; j < wordsPerDocument[i].length; j++){
      
      if(wordsPerDocument[i].includes(wordsPerDocument[i][j])){
        counter++;
      }
      idf.set(wordsPerDocument[i][j],1/(Math.log(wordsPerDocument.length/Math.abs(counter))));
    } 
  }
  console.log(idf)
  // count documents per word
  // normalize to get frequency [0, 1]
  return idf; 

}

//TODO: Task 2: transform document to word vector using the tf-idf score
// words: array of single words => [word, word, word,...]
// idf: Map of words and their idf scores
// RETURN: array of form [[word, score], [word, score], ...]
//        -> sorted in descending order of score (best score first)
export function tfidf(words, idf) {
  var counter = 0;
  const tf = new Map()

  for (let i = 0; i < words.length; i++){ 
    counter = 0;
      if(words.includes(words[i])){
        counter++;
      }
      tf.set(words[i], counter/words.length);
  }

  //Tip: d3.rollups might help your here
  return words.map(word => [word, 0]);
}