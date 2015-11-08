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
          zipcode: '',
          privacy: 'private'
        }
      }
    };
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


  // robot.respond(/my car is a (\w+)/i, function(msg){
  //   console.log("Message from user with id: " + msg.message.user.id);
  //   var car = msg.match[1];
  //   id = msg.message.user.id
  //   var user = robot.brain.userForId(id);
  //   user['car'] = car;
  //   robot.brain.set('car', car);
  //   robot.brain.save();
  //   msg.send("Got it. You drive a " + car + ".");
  // });

}
