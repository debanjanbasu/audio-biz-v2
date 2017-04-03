'use strict';
// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
const getSharePriceData = require('./functional_modules/get_share_price_data'),
    getGainersAndLosers = require('./functional_modules/get_top_gainers_and_losers'),
    getLatestNews = require('./functional_modules/get_latest_news'),
    readArticle = require('./functional_modules/read_article'),
    sendEmail = require('./functional_modules/send_email'),
    AFRTagLine = `The daily habit of successful people!`,
    menu1 = `1 Lookup information for Company Name or ASX Code! `,
    menu2 = `2 Today's Top Gainers and Losers! `,
    menu3 = `3 Latest Market News! `,
    menu4 = `4 Read Article for Article Title (I will try to match it from the Latest Articles!)`,
    menu5 = `5 Send me email for latest news`,
    menuText = `You can say any of the follwoing commands : ${menu1 + menu2 + menu3 + menu4 + menu5}`;

exports.handler = (event, context) => {
    try {
        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

        //     if (event.session.application.applicationId !== "amzn1.ask.skill.74de973d-5701-4139-a152-e9197384dbd1") {
        //         context.fail("Invalid Application ID");
        //      }

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail(`Exception: ${e}`);
    }
}

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);

    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // prepare the initial speech
    const speechOutput = `Welcome to Australian Financial Review - Audio Biz - ${AFRTagLine}. ${menuText}`;

    callback(session.attributes,
        buildSpeechletResponse(`Welcome to Australian Financial Review - Audio Biz - ${AFRTagLine}.`, speechOutput, "Sorry, I didn't get you, please ask me again!", false));
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if (intentName == 'AudioBizStock') {
        handleAudioBizRequest(intent, session, callback);
    } else if (intentName == 'GainersandLosers') {
        handleGainersandLosers(intent, session, callback);
    } else if (intentName == 'LatestNews') {
        handleLatestNews(intent, session, callback);
    } else if (intentName == 'ReadArticle') {
        handleReadArticle(intent, session, callback);
    } else if (intentName == 'SendEmail') {
        handleSendEmail(intent, session, callback);
    } else if (intentName == 'AMAZON.StopIntent' || intentName == 'AMAZON.CancelIntent') {
        handleAlexaStop(intent, session, callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);

    // Add any cleanup logic here
}

function handleAudioBizRequest(intent, session, callback) {
    // keep only the alphabets
    const companyAskedFor = intent.slots.Company.value.replace(/[^a-z]/gi, '');
    getSharePriceData(intent.slots.Company.value, data => {
        callback(session.attributes, buildSpeechletResponseWithoutCard(`You asked for company ${companyAskedFor} and the information for it is ${JSON.stringify(data)} . ${menuText}`, menuText, false));
    });
}

function handleGainersandLosers(intent, session, callback) {
    getGainersAndLosers(data => {
        callback(session.attributes, buildSpeechletResponseWithoutCard(`Top Gainers and Losers are : ${data} . ${menuText}`, menuText, false));
    });
}

function handleLatestNews(intent, session, callback) {
    getLatestNews(data => {
        callback(session.attributes, buildSpeechletResponseWithoutCard(`The latest news are : ${data} . ${menuText}`, menuText, false));
    });
}

function handleReadArticle(intent, session, callback) {
    // keep only the alphabets
    const articleAskedFor = intent.slots.Article.value;
    readArticle(articleAskedFor, data => {
        callback(session.attributes, buildSpeechletResponseWithoutCard(`You asked for article ${articleAskedFor} and the content in it is ${data} . ${menuText}`, menuText, false));
    });
}

function handleSendEmail(intent, session, callback) {
    getLatestNews(data => {
        // send the email newsletter
        sendEmail(data);
        callback(session.attributes, buildSpeechletResponseWithoutCard(`The latest news have been emailed to you . ${menuText}`, menuText, false));
    });
}

function handleAlexaStop(intent, session, callback) {
    callback(session.attributes, buildSpeechletResponseWithoutCard(`Thank you for using Australian Financial Review - Audio Biz`, "", true));
}

// ------- Helper functions to build responses -------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes,
        response: speechletResponse
    };
}
