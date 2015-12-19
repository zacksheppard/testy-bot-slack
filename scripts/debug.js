// Description:
//   commands to help debug scripts
//
//   
// Dependencies:
//   hubot-auth

//   Commands:
//   hubot debug show object for @<user name> (admin only)
//   hubot debug show msg object (admin only)
//   hubot debug log brain (admin only)

module.exports = function(robot) {

  robot.respond(/debug show object for @?([\w .\-]+)\?*$/i, function(msg) {
    if(!robot.auth.hasRole(msg.envelope.user, 'admin')){
      return msg.send("Sorry, you're not authorized to run that command.");
    }

    var name, user, users;
    var name = msg.match[1].trim();
    var users = robot.brain.usersForFuzzyName(name);
    if (users.length === 1) {
      var userObj = JSON.stringify(users[0]);
      return msg.send(name + " looks like this to me: \n ```" + userObj + "```");
    } else if (users.length === 0) {
      return msg.send("I can't find anyone by that name.");
    } else if (users.length > 1) {
      return msg.send("You'll need to be more specific. I can't tell all these results you call 'humans' apart.");
    }
  });

  robot.respond(/debug show msg object/i, function(msg){
    if(!robot.auth.hasRole(msg.envelope.user, 'admin')){
      return msg.send("Sorry, you're not authorized to run that command.");
    }

    console.log(msg);
    msg.send('Check the console.');
  });

  robot.respond(/debug log brain/i, function(msg){
    if(!robot.auth.hasRole(msg.envelope.user, 'admin')){
      return msg.send("Sorry, you're not authorized to run that command.");
    }

    console.log(robot.brain);
    msg.send('I spilled my brain all over the console.');
  });

}
