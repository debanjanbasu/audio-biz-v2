'use strict';
const apiUrl = `http://www.afr.com/public/afr/market/quote?action=detail&company=`,
    request = require('request');

module.exports = (data) => {
    return request(apiUrl + data, (error, response, body) => {
        // console.log('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body); // Print the response
        return body;
    });
}
