// Description:
//   An API to expose user information
//
// Configuration:
//   None currently
//
// Commands:
//   None

module.exports = function(robot) {
  
  robot.router.get('/api/users/:id', function(req, res) {
    var id = req.params.id;
    var user = robot.brain.userForId(id);
    userObj = JSON.stringify(user);
    return res.send(userObj);
  });

  robot.router.put('/api/users/:id', function(req, res) {
    var id = req.params.id;
    var user = robot.brain.userForId(id);
    console.log(req.body);
    return res.send("I'm not updating anyone yet. But fix this method and I can update " + user.name +  "for you next time.");
  });

  // Uses the `userForEmail` function added to hubot/src/brain.coffee
  robot.router.get('/api/users/findBy/email/:email', function(req, res) {
    var email = req.params.email;
    var user = robot.brain.userForEmail(email);
    var userObj = JSON.stringify(user);
    return res.send('{"id":"'+ user['id'] +'"}');
  });


}

