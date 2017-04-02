'use strict';
const fetch = require('node-fetch'),
    newsApiKey = "14f3a07698f84c87848ed4d4eb676b4a";

module.exports = cb => {
    // Can't use CAPI for AFR - Falling back to NEWS API
    fetch(`https://newsapi.org/v1/articles?source=abc-news-au&sortBy=top&apiKey=${newsApiKey}`)
        .then(data => {
            return data.json();
        })
        .then(json => {
            let formattedResponse = '';
            json.articles.forEach(data => {
                formattedResponse += `Headline: ${data.title}, Description: ${data.description} . `;
            });
            cb(formattedResponse);
        });
}
