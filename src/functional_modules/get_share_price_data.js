'use strict';
const fetch = require('node-fetch'),
    getClosestMatch = require('./get_closest_match_stock');

module.exports = (dataToBeFetched, cb) => {
    fetch(`http://www.afr.com/public/afr/market/quote?action=detail&company=${getClosestMatch(dataToBeFetched)}`)
        .then(data => {
            return data.json();
        })
        .then(json => {
            cb(json);
        });
}
