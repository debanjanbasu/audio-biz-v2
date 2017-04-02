'use strict';
const fetch = require('node-fetch'),
    newsApiKey = "14f3a07698f84c87848ed4d4eb676b4a",
    diffbotKey = "a8e757e495b05702e750339fbaa05222",
    getClosestMatchArticle = require('./get_closest_match_article'),
    Diffbot = require('diffbot').Diffbot,
    diffbot = new Diffbot(diffbotKey);

module.exports = (articleToBeRead, cb) => {
    // Can't use CAPI for AFR - Falling back to NEWS API
    fetch(`https://newsapi.org/v1/articles?source=abc-news-au&sortBy=top&apiKey=${newsApiKey}`)
        .then(data => {
            return data.json();
        })
        .then(json => {
            let articleTitles = [];
            json.articles.forEach(data => {
                articleTitles.push({
                    title: data.title,
                    url: data.url
                });
            });
            return articleTitles;
        }).then(articles => {
            // console.log(articles);
            const matchedArticle = getClosestMatchArticle(articleToBeRead, articles);
            diffbot.article({ uri: matchedArticle.url }, (err, response) => {
                cb(response.objects[0].text);
            });
        });
}
