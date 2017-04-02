'use strict';
const fetch = require('node-fetch');

module.exports = cb => {
    fetch(`http://www.afr.com/public/afr/market/data?action=asxgainerslosers`)
        .then(data => {
            return data.json();
        })
        .then(json => {
            let formattedResponse = '';
            json.marketData.forEach(data => {
                formattedResponse += `Security Code : ${data.securityCode}, Issuer Full Name : ${data.issuerName.fullName}, Last Price : ${data.priceLast}, ${data.priceMvtPC < 0 ? 'Loss' : 'Gain'} : ${data.priceMvtPC} %`;
            })
            cb(formattedResponse);
        });
}
