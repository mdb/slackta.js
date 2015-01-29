var Integrator = require('slack-integrator'),
    formatter = require('./formatter'),
    request = require('request');

var slackta = new Integrator({
  payload: function (req, callback) {
    var destination = req.body.text,
        endpoint = "https://septa.p.mashape.com/hackathon/NextToArrive/?req1=Suburban+Station&req2=" + destination + "&req3=3";

    request({
      url: endpoint,
      headers: {
        'X-Mashape-Key': process.env.MASHAPE_KEY,
        'Accept': 'application/json'
      }
    }, function (err, response, body) {
      if (err || response.statusCode !== 200 || !response.body.length) {
        console.log('Error: ', err);

        callback(getPayload(req, 'hiccup'));

        return false;
      }

      callback(getPayload(req, [
        '@' + req.body.user_name,
        ': The next 3 trains to ' + destination + ' from Suburban Station are...\n\n',
        formatter.format(response.body)
      ].join('')));
    });
  },

  hookPath: process.env.INCOMING_SLACK_WEB_HOOK_PATH
});

function getPayload(req, text) {
  return {
    username: 'Slackta',
    channel: req.body.channel_id,
    icon_emoji: ':septa:',
    text: text
  };
}

module.exports = slackta;
