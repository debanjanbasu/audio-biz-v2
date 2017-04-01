'use strict';
const fetch = require('node-fetch'),
    getClosestMatchStock = require('./get_closest_match_stock');

module.exports = (dataToBeFetched, cb) => {
    fetch(`http://www.afr.com/public/afr/market/quote?action=detail&company=${getClosestMatchStock(dataToBeFetched)}`)
        .then(data => {
            return data.json();
        })
        .then(json => {
            cb(json);
        });
}
