//process.env.INCOMING_SLACK_WEB_HOOK_PATH = 'fakePath';
//process.env.MASHAPE_KEY = 'fakeKey';

var assert = require('assert'),
    request = require('supertest'),
//    nock = require('nock'),
    slackta = require('../app');

describe('GET /', function() {
  it('returns "Hello world!"', function(done) {
    request(slackta.app)
      .get('/')
      .expect(200, 'Hello world!', done);
  });
});

describe('POST /integration', function() {
  /*
  var slack = nock('https://hooks.slack.com')
                .post('/services/fakePath', {
                  text: 'payload'
                })
                .reply(200),
      septa = nock('https://septa.p.mashape.com')
                .get('/hackathon/NextToArrive/?req1=Suburban+Station&req2=Ardmore&req3=3')
                .reply(200);

                */
  it('returns the properly formatted SEPTA info', function(done) {
    request(slackta.app)
      .post('/integration')
      .send({text: 'Ardmore'})
      .expect(200, 'foo', done);
  });
});
