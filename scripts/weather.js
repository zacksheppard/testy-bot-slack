// Description:
//   Watches and reports on the weather
//   
//

//   
// Dependencies: 
//  
//   
// Commands:
//   
//   hubot weather 11222 - Reports the weather in the 11222 zip code

var cronJob = require('cron').CronJob;
var tz = "America/New_York";

module.exports = function(robot){

  var format_location = function(location){
    return location.split(' ').join('_');
  };

  var current_forecast = function(data){
    var city = data.current_observation.display_location.full;
    var temp = data.current_observation.temperature_string;
    var feels_like = data.current_observation.feelslike_string;
    var humidity = data.current_observation.relative_humidity;
    var forecast_title = data.forecast.txt_forecast.forecastday[0].title;
    var forecast = data.forecast.txt_forecast.forecastday[0].fcttext;

    return 'Currently it\'s ' + temp + ' in ' + city + '. ' + 'For ' + forecast_title + ', ' + forecast;
  };

  var list_results = function(data, location){
    var results = data.response.results;
    var response = 'More than one result for ' + location + '. Prob better to *use zip code* until Zack programs me to choose one. Here\'s what I found, fwiw: \n';
    for (var i = 0; i < results.length; i++) {
      var result = '* ' + results[i].city + ', ' + results[i].state + ', ' + results[i].country + '\n'; 
      response += result;
    }
    return response;
  };

  robot.respond(/weather (.*)/, function(msg){
    var location = msg.match[1];
    
    var url = 
      'http://api.wunderground.com/api/' +
      process.env.HUBOT_WUNDERGROUND_API_KEY + 
      '/geolookup/conditions/forecast/q/' + 
      format_location(location) + '.json';
    return robot.http(url).get()(function(err, res, body) {
      var data = JSON.parse(body);
      if (data.location != null) {
        msg.send(current_forecast(data));
      } else if (data.response.results != null){
        msg.send(list_results(data, location));
      } else if (data.response.error.type === 'querynotfound'){
          msg.send(
            'No cities matched that. If the city name isn\'t working, ' +
            'try a postal code.');
      } else if (data.response.error) {
        msg.send('Weather Underground said to tell you, \n ```' + 
            'error: \n' +
            'type: '+ data.response.error.type + '\n' +
            'description: '+ data.response.error.description + '\n' +
            '```');
      }
    });

  }); 
}