// Description:
//   Test file to play with scripts
//

//   
// Dependencies:
//   cron

var cronJob = require('cron').CronJob;


module.exports = function(robot) {

  robot.respond(/my car is a (\w+)/i, function(msg){
    console.log("Message from user with id: " + msg.message.user.id);
    var car = msg.match[1];
    id = msg.message.user.id
    var user = robot.brain.userForId(id);
    user["car"] = car;
    robot.brain.set('car', car);
    robot.brain.save();
    msg.send("Got it. You drive a " + car + ".");
  });

  robot.respond(/what is my car/i, function(msg){
    console.log(msg);
    id = msg.message.user.id
    user = robot.brain.userForId(id);
    msg.send("You drive a " + user.car + ".");
  });

  robot.respond(/fartface/, function(msg){
    msg.send("You're a fart face!");
  });

}