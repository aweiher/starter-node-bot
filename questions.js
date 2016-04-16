
var askStart = function( response, convo) {
    convo.ask('Are you interested in some amazing project opportunities?', [
        {
            pattern: bot.utterances.yes,
            callback: function(response,convo) {
                convo.say('Great!');
                //askSkills(response, convo);
                convo.next();
            }
        }/*,
        {
            pattern: bot.utterances.no,
            callback: function(response,convo) {
                convo.say('No Problem - just write me as soon you are interested.');
                // do something else...
                convo.next();
            }
        },
        {
            default: true,
            callback: function(response,convo) {
                convo.say('Sorry, I dont understand you .. Please answer with yes or no.');
                convo.repeat();
                convo.next();
            }
        }*/
    ]
    );
};

var askSkills = function( response, convo) {
    convo.ask('Which of the following skills do you have? (*backend*, *frontend*, *api*)', [
        {
            pattern: 'backend',
            callback: function (response, convo) {
                convo.say('Perfect!');
                convo.next();
            }
        }, {
            pattern: 'backend',
            callback: function (response, convo) {
                convo.say('Perfect!');
                convo.next();
            }
        }, {
            pattern: 'backend',
            callback: function (response, convo) {
                convo.say('Perfect!');
                convo.next();
            }
        }, {
            default: true,
            callback: function(response,convo) {
                convo.say('I did not understand which projects you search.');
                convo.repeat();
                convo.next();
            }
        }
    ]);
};


module.exports = {
    askStart: askStart,
    askSkills: askSkills
};