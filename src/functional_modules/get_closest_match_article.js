'use strict';
const fuzzysetJS = require('fuzzyset.js');

module.exports = (dataToBeMatched, arrayOfArticles) => {
    const articlesFuzzySet = new fuzzysetJS(arrayOfArticles.map(data => data.title));

    // If use_levenshtein is false, then we return all top matched elements with the same cosine similarity.
    articlesFuzzySet.useLevenshtein = false;

    // check if it is already the share price code
    const matchedTitle = articlesFuzzySet.get(dataToBeMatched)[0][1];

    // return the matched article element
    return arrayOfArticles.find(data => data.title == matchedTitle);

}