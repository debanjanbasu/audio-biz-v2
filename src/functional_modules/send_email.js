'use strict';
const api_key = 'key-afaf0f3cff4c1a5c6d45a7782d9d7956',
    domain = 'www.afr.com',
    mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });

module.exports = (emailBody) => {
    const data = {
        from: 'Australian Financial Review - Audio Biz <me@samples.mailgun.org>',
        to: 'debanjan.basu@fairfaxmedia.com.au',
        subject: 'All top news and headlines',
        text: emailBody
    };

    mailgun.messages().send(data, (error, body) => {
        console.log(body);
    });
}
