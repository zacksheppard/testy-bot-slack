// Description:
//   An API to expose user information
//
// Configuration:
//   None currently
//
// Commands:
//   None

var express = require('express');
var app = express();

module.exports = function(robot) {
  
  // zack user id is: http://localhost:8080/api/user/U03H5KTB8
  return robot.router.get('/api/user/:id', function(req, res) {
    var id = req.params.id;
    var data = robot.brain.userForId(id);
    userObj = JSON.stringify(data);
    return res.send("OK" + userObj);
  });

  return robot.router.get('/hello', function(req, res){
    return res.send('Hello world');
  });



};

