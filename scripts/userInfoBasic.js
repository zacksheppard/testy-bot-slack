// Description:
//   Save basic user info which might be useful to other scripts
//   
//

//   
// Dependencies: 
//  
//   
// Commands:
//   
//   hubot profile location add a location

// Commands CRUD Style:
//   
//   hubot profile location add home 11222 - add home location
//   hubot profile location add <custom name>: 11222 - add custom location

var util = require('./utils.js');

module.exports = function(robot){

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
          tz_offset: 0
        } 
      }
    };
    setTimeZone(userId, function(){
      console.log('User scaffolded and timezone set.');
    });
  }; 

  var getTimeZone = function(userId){
    var user = robot.brain.userForId(userId);

    if(user.profile.locations.home.tz_offset){
      return user.profile.locations.home.tz_offset;
    } else {
      setTimeZone(userId, function(){
        return user.profile.locations.home.tz_offset;
      });
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



  robot.respond(/profile location add (.*)/i, function(msg){
    var locationName = msg.match[1].match(/[a-zA-Z0-9_ ]+/);
    var locationZip = msg.match[1].match(/\d+/);
    var id = msg.message.user.id
    var user = robot.brain.userForId(id);
    if (!user.profile) {
      scaffoldProfile(user.id);
      console.log('Profile scaffold complete.');
    }
    user.profile.locations[locationName] = locationZip;
    msg.send(
      "Got it. I saved a location called " + 
      locationName + 
      " as  " + user.profile.locations[locationName] + ".");
  });

  robot.respond(/set timezone/i, function(msg){
    var userId = msg.message.user.id;
    var user = robot.brain.userForId(userId);
    if(!util.checkNestedProperties(user, 'profile', 'locations', 'home', 'tz')){
      setTimeZone(userId, function(){
        msg.send('Your timezone has been set to ' + 
          user.profile.locations.home.tz_label);   
      });
    } else {
      msg.send('Your timezone was already set to ' + 
        user.profile.locations.home.tz_label);   
    }
  });



}
