var Botkit = require('botkit')

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


require('beepboop-botkit').start(controller);

controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I'm here!")
});
//
//controller.configureSlackApp({
//  clientId: bot.config.clientId,
//  clientSecret: bot.config.clientSecret,
//  scopes: ['incoming-webhook']
//});

controller.hears(['hello', 'hi'], ['direct_mention'], function (bot, message) {
  bot.reply(message, 'I send you a message.');

  var questions = require('./questions.js').init(bot, message);
  bot.startPrivateConversation(message, questions.askStart);
});


controller.hears(['hello', 'hi'], ['direct_message'], function (bot, message) {

  var questions = require('./questions.js').init(bot, message);

  bot.startConversation(message, questions.askStart);
});

controller.hears(['add'], ['direct_message'], function (bot, message) {
  var questions = require('./questions.js').init(bot, message);

  bot.startConversation(message, questions.addProject);
});


controller.hears('.*', ['mention'], function (bot, message) {
  bot.reply(message, 'I heard you like projects? :heart:')
})

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
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {
    console.log(err, resp)
  })
})


// debug

controller.hears(['debug_info'], ['direct_message'], function (bot, message) {
  bot.reply(message, "ENV: " + JSON.stringify(bot.config))
});

//
//controller.setupWebserver(process.env.PORT,function(err,webserver) {
//
//  webserver.get('/',function(req,res) {
//
//    var html = '<h1>Super Insecure Form</h1><p>Put text below and hit send - it will be sent to every team who has added your integration.</p><form method="post" action="/unsafe_endpoint"><input type="text" name="text" /><input type="submit"/></form>';
//    res.send(html);
//
//  });
//
//  // This is a completely insecure form which would enable
//  // anyone on the internet who found your node app to
//  // broadcast to all teams who have added your integration.
//  // it is included for demonstration purposes only!!!
//  webserver.post('/unsafe_endpoint',function(req,res) {
//    var text = req.body.text;
//    text = text.trim();
//
//    controller.storage.teams.all(function(err,teams) {
//      var count = 0;
//      for (var t in teams) {
//        if (teams[t].incoming_webhook) {
//          count++;
//          controller.spawn(teams[t]).sendWebhook({
//            text: text
//          },function(err) {
//            if(err) {
//              console.log(err);
//            }
//          });
//        }
//      }
//
//      res.send('Message sent to ' + count + ' teams!');
//    });
//  });
//
//  controller.createOauthEndpoints(controller.webserver,function(err,req,res) {
//    if (err) {
//      res.status(500).send('ERROR: ' + err);
//    } else {
//      res.send('Success!');
//    }
//  });
//});


// global fallback
controller.hears('.*', ['direct_message', 'direct_mention'], function (bot, message) {
  bot.reply(message, 'Sorry <@' + message.user + '>, I don\'t understand. \n')
});