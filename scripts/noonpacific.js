// Description:
//   Have Hubot remind you that it is Noon in the Pacific time zone 
//   and noonpacific.com has a new playlist out
//

//   
// Dependencies:
//   cron

var cronJob = require('cron').CronJob;
var tz = "America/Los_Angeles";

module.exports = function(robot) {
  // "use strict";

  var its_noon_messages = [
    "It's Noon Pacific!",
    "Time for some new music! http://noonpacific.com",
    "Boom! http://noonpacific.com",
    "Has it been a week already?"
  ];

  var itsNoonPacific = function() {
    var rand_message = its_noon_messages[Math.floor(Math.random() * its_noon_messages.length)];
    robot.messageRoom('general', rand_message);
  }
  new cronJob('00 00 12 * * 1', itsNoonPacific, null, true, tz);

}