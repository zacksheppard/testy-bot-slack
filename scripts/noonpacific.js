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

  var itsNoonMessages = [
    "It's Noon Pacific!",
    "Time for some new music! http://noonpacific.com",
    "Boom! http://noonpacific.com",
    "Has it been a week already?"
  ];

  var itsNoonPacific = function() {
    var rand_message = itsNoonMessages[Math.floor(Math.random() * itsNoonMessages.length)];
    robot.messageRoom('general', rand_message);
  }
  new cronJob('00 00 12 * * 1', itsNoonPacific, null, true, tz);

}