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
//   hubot weather watch 11222 - Watches the weather in the 11222 zip code

module.exports = function(robot){

  robot.respond(/weather (.*)/, function(msg){
    var location = msg.match[1];
    
    var format_location = function(location){
      return location.split(' ').join('_');
    };

    var url = 
      'http://api.wunderground.com/api/' +
      '725b139083f86186' + 
      '/geolookup/conditions/forecast/q/' + 
      format_location(location) + '.json';

    return robot.http(url).get()(function(err, res, body) {
      var data = JSON.parse(body);
      if (data.location != null) {
        console.log(data.location);
        var city = data.current_observation.display_location.full;
        var temp = data.current_observation.temperature_string;
        var feels_like = data.current_observation.feelslike_string;
        var humidity = data.current_observation.relative_humidity;
        var forecast_title = data.forecast.txt_forecast.forecastday[0].title;
        var forecast = data.forecast.txt_forecast.forecastday[0].fcttext;

        return msg.send('Currently it\'s ' + temp + ' in ' + city + '. ' + 'For ' + forecast_title + ', ' + forecast);
      } else if (data.response.results != null){
        var results = data.response.results;
        var response = 'More than one result for ' + location + '. Prob better to *use zip code* until Zack programs me to choose one. Here\'s what I found, fwiw: \n';
        for (var i = 0; i < results.length; i++) {
          var result = '* ' + results[i].city + ', ' + results[i].state + ', ' + results[i].country + '\n'; 
          response += result;
        }
        return msg.send(response);
      }

    });

  }); 
}