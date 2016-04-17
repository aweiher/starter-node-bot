var Botkit = require('botkit');
var users = require('./users.json');

// Expect a SLACK_TOKEN environment variable
//var slackToken = process.env.SLACK_TOKEN
//if (!slackToken) {
//  console.error('SLACK_TOKEN is required!')
//  process.exit(1)
//}

var controller = Botkit.slackbot()

/*
var bot = controller.spawn({
  token: slackToken
})

bot.startRTM(function (err, bot, payload) {
  if (err) {
    throw new Error('Could not connect to Slack')
  }
})*/


var bot = require('beepboop-botkit').start(controller);

controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I'm here!")
});

controller.hears(['hello', 'hi'], ['direct_mention'], function (bot, message) {
  bot.reply(message, 'I send you a message.');

  var questions = require('./questions.js').init(bot, message);
  bot.startPrivateConversation(message, questions.askStart);
});


controller.hears(['hello', 'hi'], ['direct_message'], function (bot, message) {

  var questions = require('./questions.js').init(bot, message);

  if(message.user === 'U0Z1DQ928' || message.user === 'U10R4L3CN') {
    bot.startConversation(message, questions.askProfession);
  } else {
    bot.startConversation(message, questions.askStart);
  }
});

controller.hears(['add'], ['direct_message'], function (bot, message) {
  var questions = require('./questions.js').init(bot, message);

  bot.startConversation(message, questions.addProject);
});


controller.hears('.*', ['mention'], function (bot, message) {
  bot.reply(message, 'I heard you like projects? :heart:')
});

controller.hears('help', ['direct_message', 'direct_mention'], function (bot, message) {
  var help = 'I will respond to the following messages: \n' +
      '`bot hi` for a simple message.\n' +
      '`bot attachment` to see a Slack attachment message.\n' +
      '`@<your bot\'s name>` to demonstrate detecting a mention.\n' +
      '`bot help` to see this again.'
  bot.reply(message, help)
});

controller.hears(['attachment'], ['direct_message', 'direct_mention'], function (bot, message) {
  var text = 'Beep Beep Boop is a ridiculously simple hosting platform for your Slackbots.'
  var attachments = [{
    fallback: text,
    pretext: 'We bring bots to life. :sunglasses: :thumbsup:',
    title: 'Host, deploy and share your bot in seconds.',
    image_url: 'https://storage.googleapis.com/beepboophq/_assets/bot-1.22f6fb.png',
    title_link: 'https://beepboophq.com/',
    text: text,
    color: '#7CD197'
  }];

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {
    console.log(err, resp)
  })
});

controller.hears(["subscribe (.*)"], ['direct_mention', 'direct_message'], function(bot, message) {
  var requestedCategory = message;
  bot.reply(message, "OK - I will send you jobs for "+ requestedCategory +"!");
});

// Teacher, Bereichsleiterin, Software Engineer,

function parseResults(results) {
  return results.map(function(result) {
    return {
      title: result.Name,
      text: result.Title,
      image_url: result.PhotoUrls,
      title_link: result.Link,
      color: '#7CD197'
    }
  });
}

controller.hears(["search (.*)"], ['direct_mention', 'direct_message'], function(bot, message) {
  var match = message.match[1];

  var results = [];

  bot.reply(message, 'searching the database ..');

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

  bot.reply(message, 'found ' + results.length + ' Results');
  bot.reply(message, {
    attachments: parseResults(results)
  });
});


// debug

controller.hears(['debug_info'], ['direct_message'], function (bot, message) {
  bot.reply(message, "ENV: " + JSON.stringify(bot.config))
});

// global fallback
controller.hears('.*', ['direct_message', 'direct_mention'], function (bot, message) {
  bot.reply(message, 'Sorry <@' + message.user + '>, I don\'t understand. \n')
});