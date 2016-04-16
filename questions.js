var projects = {
  backend: [],
  frontend: [],
  api: []
};

exports.init = function (bot) {


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
  };

  var askSkills = function (response, convo) {
    convo.ask('Which of the following skills do you have? (*backend*, *frontend*, *api*)', [
      {
        pattern: 'frontend',
        callback: function (response, convo) {
          convo.say('Perfect!');
          tellProjects("frontend");
          convo.next();
        }
      }, {
        pattern: 'backend',
        callback: function (response, convo) {
          convo.say('Amazing!');
          tellProjects("backend");
          convo.next();
        }
      }, {
        pattern: 'api',
        callback: function (response, convo) {
          convo.say('Awesome!');
          tellProjects("api");
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

  var tellProjects = function(response, convo) {


    if(projects.length) {
      convo.say('Lets see .. I have *' + projects.length + '* for you');
      projects.forEach(function(project, index) {
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