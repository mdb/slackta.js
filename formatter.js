module.exports = {
  format: function (responseBody) {
    var body = JSON.parse(responseBody);

    return [
      body[0].orig_line + ' line \n',
      getDetails(body[0]),
      getDetails(body[1]),
      getDetails(body[2])
    ].join('\n');
  }
};

function getDetails(obj) {
  return [
    'Departure: ' + obj.orig_departure_time,
    'Arrival: ' + obj.orig_arrival_time,
    'Delay: ' + obj.orig_delay + '\n'
  ].join('\n');
}
