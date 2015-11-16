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
          tz_offset: ''
        } 
      }
    };
  }; 

  var setTimeZone = function(userId){
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
      console.log("Timezone set to " +
        "tz: " + user.profile.locations.home.tz + "\n" +
        "tz_label: " + user.profile.locations.home.tz_label + "\n" +
        "tz_offset: " + user.profile.locations.home.tz_offset + "\n"
      );
    });

  };

  robot.respond(/profile location add (.*)/i, function(msg){
    // console.log(msg);
    var locationName = msg.match[1].match(/[a-zA-Z0-9_ ]+/);
    var locationZip = msg.match[1].match(/\d+/);
// debugger
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
    setTimeZone(userId);
    msg.send(
      "tz: " + user.profile.locations.home.tz + "\n" +
      "tz_label: " + user.profile.locations.home.tz_label + "\n" +
      "tz_offset: " + user.profile.locations.home.tz_offset + "\n"
    );
  });

}
