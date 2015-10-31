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
    
    var API_KEY_WUNDERGROUND = '725b139083f86186';
    var conditions_url = 
      'http://api.wunderground.com/api/' +
      API_KEY_WUNDERGROUND + 
      '/conditions/q/' + location + '.json';

    var response = "";

    return msg.http(conditions_url).get()(function(err, res, body){
      var data = JSON.parse(body);

      response = data.current_observation.temperature_string;
      console.log('THE TEMP IS' + response);

      return msg.send(response);
    });
  }); 
}