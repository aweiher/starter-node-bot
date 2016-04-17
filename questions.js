var projects = {
  backend: [],
  frontend: [],
  api: []
};

var users = require('./users.json');

exports.init = function (bot, message) {
  function parseResults(results) {
    return results.map(function(result) {
      return {
        title: result.Name,
        text: result.Title,
        thumb_url: result.PhotoUrls,
        title_link: result.Link,
        color: '#7CD197'
      }
    });
  }

  var searchProfession = function(response, convo) {
    var match = response.match[1];

    var results = [];

    convo.say('searching the database ..');

    for(userIdx in users) {
      var user = users[userIdx];

      if(results.length > 10) {
        break;
      }

      user.Link = "http://hrslack.crapkin.de/?name="+user.Name+"&title="+user.Title+"&pic="+user.PhotoUrls;

      if(user.SlackName === match) {
        results.push(user);
      }

      if(match === "developer" && user.Title === "Software Engineer [test]") {
        results.push(user);
      }

      if(match === "manager" && user.Title === "Projektleiter [test]") {
        results.push(user);
      }
    }

    convo.say('found ' + results.length + ' Results');
    bot.reply(message, {
      attachments: parseResults(results)
    });
  };


  var askProfession = function(response, convo) {
    convo.ask('Hi  <@' + message.user + '> - what can I do for you?', [
      {
        pattern: ".* search for (.*)",
        callback: function (response, convo) {
          var profession = response.match[1];

          if(profession === 'developer') {
            convo.ask('Which Type of developer are you looking for? [*java*, *frontend*, *database*]', function(cur_response, convo) {
              convo.say('Great - I will search for *'+ cur_response.text +' '+ profession +'* !');
              searchProfession(response, convo);
              convo.next();
            });
          } else {
            convo.say('Great - I will search for '+ profession +' !');
            searchProfession(response, convo);
          }


          convo.next();
        }
      }
    ]);
  };

  var addProject = function(response, convo) {
    convo.ask("Which category is the project?", function() {

      convo.ask("What is the title of the project?", function() {
        convo.next();
      });

      convo.next();
    });

    convo.on('end',function(convo) {

      if (convo.status=='completed') {
        var res = convo.extractResponses();

        bot.reply(message, {
          icon_emoji: ':memo:',
          text: "add project: " + JSON.stringify(res)
        });

      }
    });

  };

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

        convo.ask('Should I inform you, when I have projects like this?', [
          {
            pattern: bot.utterances.yes,
            callback: function (response, convo) {
              convo.say('Ok - I will inform you!');
              askSkills(response, convo);
              convo.next();
            }
          },
          {
            pattern: bot.utterances.no,
            callback: function (response, convo) {
              convo.say('No Problem - you can always write me if you change your mind.');
              // do something else...
              convo.next();
            }
          }
        ]);
      });
    } else {
      convo.say('Oh noes .. I have no projects for you!');
    }

  };

  var likeProjects = function(response, convo) {
    convo.ask(message, 'I heard you like projects? :heart:', [
      {
        pattern: bot.utterances.yes,
        callback: function (response, convo) {
          convo.say('Awesome! :rocket: ');
          askStart(response, convo);
          convo.next();
        }
      },
      {
        pattern: bot.utterances.no,
        callback: function (response, convo) {
          convo.say('sad bot is sad :robot_face: ');
          // do something else...
          convo.next();
        }
      }
    ]);
  };


  return {
    askStart: askStart,
    askSkills: askSkills,
    addProject: addProject,
    askProfession: askProfession,
    likeProjects: likeProjects
  };
};