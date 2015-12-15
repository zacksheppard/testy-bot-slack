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
var moment = require('moment');
var util = require('./util');

module.exports = function(robot){

  var getTimeZone = function(userId, callback){
    var user = robot.brain.userForId(userId);

    if(!util.checkNestedProperties(user, 'profile', 'locations', 'home', 
      'tz_offset')){
      setTimeZone(userId, function(){
        console.log('Timezone set.');
        callback();
      });
    } else {
      callback();
    }
  };

  var setTimeZone = function(userId, callback){
    var user = robot.brain.userForId(userId);
    var url = "https://slack.com/api/users.list?token=" + 
    process.env.HUBOT_SLACK_TOKEN;

    if(!user.profile){
      scaffoldProfile(userId);
    }
    robot.http(url).get()(function(err, res, body) {
      var data = JSON.parse(body);
      for(var i=0; i < data.members.length; i++){
        if (data.members[i].id === userId){
          user.profile.locations.home.tz = data.members[i].tz;
          user.profile.locations.home.tz_label = data.members[i].tz_label;
          user.profile.locations.home.tz_offset = data.members[i].tz_offset;
        }
      }
      callback();
    });

  };

  var scaffoldProfile = function(userId){
    var user = robot.brain.userForId(userId);
    user.profile = {
      locations: {
        home: {
          city: '',
          state: '',
          country_code: '',
          postal_code: '',
          tz: '',
          tz_label: '',
          tz_offset: ''
        } 
      }
    };
  };

  var locationSearch = function(location, callback){
    var results = [];
    var location_url;
    if(location.postalCode){
      location_url = location.postalCode
    } else if  (location.city && location.state){
      location_url = location.state + '/' + location.city;
    } else if (location.city && location.state){
      location_url = location.state + '/' + location.city;
    } else {
      location_url = location.city;
    }

    var url = 'http://api.wunderground.com/api/' + process.env.HUBOT_WUNDERGROUND_API_KEY + 
      '/geolookup/q/' + 
      location_url + '.json';

    robot.http(url).get()(function(err, res, body) {
      var data = JSON.parse(body);
      if (data.location != null) {
        results.push(data.location);
        results;
      } else if (data.response.results != null){
        results = data.response.results;
      } else if (data.response.error) {
        throw new Error(data.response.error);
      }
      callback(results);
    });
  };

  var currentForecast = function(room, location){
    var message = '';
    var url = 
      'http://api.wunderground.com/api/' +
      process.env.HUBOT_WUNDERGROUND_API_KEY + 
      '/geolookup/conditions/forecast/q/' + 
      location + '.json';

    robot.http(url).get()(function(err, res, body) {
      var data = JSON.parse(body);
      if (data.location != null) {
        var city = data.current_observation.display_location.full;
        var temp = data.current_observation.temperature_string;
        var feels_like = data.current_observation.feelslike_string;
        var humidity = data.current_observation.relative_humidity;
        var forecast_title = data.forecast.txt_forecast.forecastday[0].title;
        var forecast = data.forecast.txt_forecast.forecastday[0].fcttext;
        message = 'Currently it\'s ' + temp + ' in ' + city + '. ' + 'For ' + forecast_title + ', ' + forecast;
      } else if (data.response.results != null){
        return 'More than one result for ' + location + 
          '. Prob better to *use zip code* until Zack programs me to choose one.';
      } else if (data.response.error.type === 'querynotfound'){
        message = 
          'No cities matched that. If the city name isn\'t working, ' +
          'try a postal code.';
      } else if (data.response.error) {
        message = 'Weather Underground said to tell you, \n ```' + 
          'error: \n' +
          'type: '+ data.response.error.type + '\n' +
          'description: '+ data.response.error.description + '\n' +
          '```';
      }

      robot.messageRoom(room, message);
    });
  };

  var checkSchedule = function(){

    if(!robot.brain.scheduledEvents) {
      robot.brain.scheduledEvents = [];
    }
    var events = robot.brain.scheduledEvents;
    var now = new Date;
    var minutes   = now.getUTCHours() * 60 + now.getUTCMinutes();
    for(var i=0; events.length > i; i++){
      var eventMinutes = parseInt(events[i].hour) * 60 + parseInt(events[i].minute);
      console.log('eventMinutes: ' + eventMinutes + '. minutes: ' + minutes);
      if(eventMinutes === minutes){
        currentForecast(events[i].room, events[i].location);
      }
    }
  };

  new cronJob('1 * * * * 0-7', checkSchedule, null, true)

  robot.respond(/weather watch (.*)/i, function(msg){
    var parsedMsg = /(.*) (at|@) (\d{1,2}:*\d{0,2}\s*[am|pm]*)/.exec(msg.match[1]);

    var user = robot.brain.userForId(msg.message.user.id);

    var time = util.formatTime(parsedMsg[3]);
    var hour = parseInt(time[1]);
    var minute = parseInt(time[2]);
    var tzOffset = getTimeZone(user.id, function(){

      tzOffset = user.profile.locations.home.tz_offset / 3600;
      tzOffset = tzOffset * -1;
      var hourUTC = hour + tzOffset;
      console.log('tzOffset: ' + tzOffset + '. hourUTC: ' + hourUTC);
    
      var locationObj = util.formatLocation(parsedMsg[1]);
      locationSearch(locationObj, function(results){
        if(results.length === 1) {
          if(!robot.brain.scheduledEvents){
            robot.brain.scheduledEvents = [];
          }
          robot.brain.scheduledEvents.push(
            {
              hour: hourUTC,
              minute: minute,
              room: msg.envelope.room,
              location: results[0].zip
            }
          );
          if (time[1] > 12) {
            time[1] = parseInt(time[1]) - 12;
          }
          msg.send('I\'ll let you know the weather in ' + results[0].city + ', ' +
           results[0].state + ' at ' + time[1] + ':' + time[2] + time[3] + '.');
        }
      });
    });
  });

  robot.respond(/weather show (.*)/, function(msg){
    var location = msg.match[1];
    currentForecast(msg.envelope.room, location);
  }); 

}