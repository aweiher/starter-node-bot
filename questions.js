var projects = {
  backend: [],
  frontend: [],
  api: []
};

exports.init = function (bot, message) {


  var askStart = function (response, convo) {
    convo.say('Hello <@' + message.user + '>!');
    convo.ask('Are you interested in some amazing project opportunities?', [
        {
          pattern: bot.utterances.yes,
          callback: function (response, convo) {
            convo.say('Great!');
            askSkills(response, convo);
            convo.next();
          }
        },
        {
          pattern: bot.utterances.no,
          callback: function (response, convo) {
            convo.say('No Problem - just write me as soon you are interested.');
            // do something else...
            convo.next();
          }
        },
        {
          default: true,
          callback: function (response, convo) {
            convo.say('Sorry, I dont understand you .. Please answer with yes or no.');
            convo.repeat();
            convo.next();
          }
        }
      ]
    );

    convo.on('end',function(convo) {

      if (convo.status=='completed') {
        // do something useful with the users responses
        var res = convo.extractResponses();

        // reference a specific response by key
        // var value  = convo.extractResponse('key');

        // ... do more stuff...

        bot.reply(message, {
          icon_emoji: ':card_index_dividers:',
          text: "completed - " + JSON.stringify(res)
        });

      } else {
        // something happened that caused the conversation to stop prematurely

        bot.reply(message, {
          icon_emoji: ':card_index_dividers:',
          text: "status: " + convo.status
        });
      }

    });
  };


  var askSkills = function (response, convo) {
    convo.ask('Which of the following skills do you have? (*backend*, *frontend*, *api*)', [
      {
        pattern: 'frontend',
        callback: function (response, convo) {
          convo.say('Perfect!');
          tellProjects(response, convo, "frontend");
          convo.next();
        }
      }, {
        pattern: 'backend',
        callback: function (response, convo) {
          convo.say('Amazing!');
          tellProjects(response, convo, "backend");
          convo.next();
        }
      }, {
        pattern: 'api',
        callback: function (response, convo) {
          convo.say('Awesome!');
          tellProjects(response, convo, "api");
          convo.next();
        }
      }, {
        default: true,
        callback: function (response, convo) {
          convo.say('I did not understand which projects you search.');
          convo.repeat();
          convo.next();
        }
      }
    ]);
  };

  var tellProjects = function(response, convo, projectCategory) {
    var projectsArr = projects[projectCategory];

    if(projectsArr.length) {
      convo.say('Lets see .. I have *' + projectsArr.length + '* for you');
      projectsArr.forEach(function(project, index) {
        var count = index + 1;
        convo.say("#" + count + ': ' + project.title);
      });
    } else {
      convo.say('Oh noes .. I have no projects for you!');
    }

  };


  return {
    askStart: askStart,
    askSkills: askSkills
  };
};