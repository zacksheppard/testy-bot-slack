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
    
    var conditions_url = 
      'http://api.wunderground.com/api/725b139083f86186/conditions/q/' + location + '.json';

    return msg.http(conditions_url).get()(function(err, res, body){
      var data = JSON.parse(body);
      var temp = data.current_observation.temperature_string;
      var city = data.current_observation.display_location.full;
      return msg.send('The current temp in ' + city + ' is ' + temp + '.');
    });
  }); 
}