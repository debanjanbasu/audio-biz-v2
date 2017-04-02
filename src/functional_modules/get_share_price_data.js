'use strict';
const fetch = require('node-fetch'),
    getClosestMatchStock = require('./get_closest_match_stock');

module.exports = (dataToBeFetched, cb) => {
    const companyASXCode = getClosestMatchStock(dataToBeFetched);
    fetch(`http://www.afr.com/public/afr/market/quote?action=detail&company=${companyASXCode}`)
        .then(data => {
            return data.json();
        })
        .then(json => {
            const formattedResponse = `Security Code : ${json.marketData[companyASXCode].securityCode}, Issuer Name : ${json.marketData[companyASXCode].issuerName.fullName}, Last Price : $ ${json.marketData[companyASXCode].priceLast}, Price Movement : ${json.marketData[companyASXCode].priceMvt} $, Price Movement in percentage : ${json.marketData[companyASXCode].priceMvtPC} %, Traded Volume : ${json.marketData[companyASXCode].volume}, Traded Value : ${json.marketData[companyASXCode].vlaue}, Company Profile : ${json.marketData[companyASXCode].issuerPrincipalActivity}, ASIC Code : ${json.marketData[companyASXCode].issuerASICNumber}`;
            cb(formattedResponse);
        });
}
