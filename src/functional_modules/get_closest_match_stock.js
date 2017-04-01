'use strict';
const stocks = require('../company_map_asx.json');
const companyFuzzySet = new require('fuzzyset.js')(stocks.map((data) => {
    return data.company_name;
}));

// If use_levenshtein is false, then we return all top matched elements with the same cosine similarity.
companyFuzzySet.useLevenshtein = false;

// console.log(companyFuzzySet.get("commbank"));

module.exports = dataToBeMatched => {
    const fullCompanyName = companyFuzzySet.get(dataToBeMatched)[0][1];
    // returns the three letter company code
    return stocks[companyFuzzySet.values().indexOf(fullCompanyName)].ASXcode;
}
