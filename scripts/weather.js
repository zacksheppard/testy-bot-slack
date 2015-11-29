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
//   hubot weather show 11222 - Reports the weather in the 11222 zip code
//   hubot weather watch 11222 - Watches the weather in the 11222 zip code

var cronJob = require('cron').CronJob;
var tz = "America/New_York";

module.exports = function(robot){

  var format_location = function(location){
    var formattedLocation = {};
    var city, state, country, postalCode;
    var loc = location.split(',');
    if( loc.length === 3){
      formattedLocation.city = loc[0];
      formattedLocation.state = loc[1];
      formattedLocation.country = loc[2];
    } else if (loc.length === 2){
      formattedLocation.city = loc[0];
      formattedLocation.state = loc[1];
    } else if (!isNaN(loc)){
      formattedLocation.postalCode = loc[0];
    } else {
      formattedLocation.city = loc[0];
    }
    return formattedLocation;
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

    robot.respond(/weather watch (.*)/i, function(msg){
      console.log(msg.match);
      var parsedMsg = /(.*) (at|@) (\d{1,2}:*\d{0,2})([ap]m)*/.exec(msg.match[1]);
      // matches
      // 11222 at 9pm
      // Brooklyn, ny at 10am
      // 11222 @ 10:00pm
      var location = format_location(parsedMsg[1]);
      var time = parsedMsg[3];
      var meridian;
      if(parsedMsg[4]){
        meridian = parsedMsg[4];
      }
      console.log('LOCATION: ' + JSON.stringify(location));
      
      msg.send('time: ' + time + '.meridian: ' + meridian);
    });

  robot.respond(/weather show (.*)/, function(msg){
    var location = msg.match[1];
    
    var url = 
      'http://api.wunderground.com/api/' +
      process.env.HUBOT_WUNDERGROUND_API_KEY + 
      '/geolookup/conditions/forecast/q/' + 
      location + '.json';
    return robot.http(url).get()(function(err, res, body) {
      var data = JSON.parse(body);
      if (data.location != null) {
        msg.send(current_forecast(data));
      } else if (data.response.results != null){
        msg.send(list_results(data, location));
      } else if (data.response.error.type === 'querynotfound'){
          msg.send(
            'No cities matched that. If the city name isn\'t working, ' +
            'try a postal code.'
          );
      } else if (data.response.error) {
        msg.send('Weather Underground said to tell you, \n ```' + 
            'error: \n' +
            'type: '+ data.response.error.type + '\n' +
            'description: '+ data.response.error.description + '\n' +
            '```');
      }
    });

    // robot.respond(/weather home (.*)/, function(msg){
    //   var location = msg.match[1];
    //   var id = msg.message.user.id;
    //   var user = robot.brain.userForId(id);
    //   // debugger

    //   user.weather = {'locations': {'home': location }};

    //   msg.send(
    //     'Your home weather has been set to ' + user.weather + '.'
    //     );

    // });




  }); 
}