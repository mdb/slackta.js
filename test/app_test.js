process.env.INCOMING_SLACK_WEB_HOOK_PATH = 'fakePath';
process.env.MASHAPE_KEY = 'fakeKey';

var request = require('supertest'),
    nock = require('nock'),
    slackta = require('../app');

describe('GET /', function() {
  it('returns "Hello world!"', function(done) {
    request(slackta.app)
      .get('/')
      .expect(200, 'Hello world!', done);
  });
});

describe('POST /integration', function() {
  var slack = nock('https://hooks.slack.com')
                .post('/services/fakePath', {
                  text: "The next 3 trains to Ardmore from Suburban Station are...\n\nundefined line \n\nDeparture: 1:00\nArrival: 2:00\nDelay: 1\n\nDeparture: 2:00\nArrival: 3:00\nDelay: 2\n\nDeparture: 3:00\nArrival: 4:00\nDelay: 3\n"
                })
                .reply(200),
      septa = nock('https://septa.p.mashape.com')
                .get('/hackathon/NextToArrive/?req1=Suburban+Station&req2=Ardmore&req3=3')
                .reply(200, [{
                  orig_departure_time: '1:00',
                  orig_arrival_time: '2:00',
                  orig_delay: '1'
                },{
                  orig_departure_time: '2:00',
                  orig_arrival_time: '3:00',
                  orig_delay: '2'
                },{
                  orig_departure_time: '3:00',
                  orig_arrival_time: '4:00',
                  orig_delay: '3'
                }]);

  it('returns the properly formatted SEPTA info', function(done) {
    request(slackta.app)
      .post('/integration')
      .send({text: 'Ardmore'})
      .expect(200, done);
  });
});
