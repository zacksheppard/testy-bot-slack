// Description:
//   Test file to play with scripts
//

//   
// Dependencies:
//   cron

var cronJob = require('cron').CronJob;


module.exports = function(robot) {

  robot.respond(/show the user object for @?([\w .\-]+)\?*$/i, function(res) {
    var name, user, users;
    var name = res.match[1].trim();
    var users = robot.brain.usersForFuzzyName(name);
    if (users.length === 1) {
      userObj = JSON.stringify(users[0]);
      return res.send(name + " looks like this to me: \n ```" + userObj + "```");
    } else if (users.length === 0) {
      return res.send("I can't find anyone by that name.");
    } else if (users.length > 1) {
      return res.send("You'll need to be more specific. I can't tell all these results you call 'humans' apart.");
    }
  });

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

  robot.respond(/view message object/i, function(msg){
    console.log(msg);
    msg.send('Check the console.');
  });

  robot.respond(/console.log brain/i, function(msg){
    console.log(robot.brain);
    msg.send('Check the console.');
  });

}