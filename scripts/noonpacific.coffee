# Description:
#   Have Hubot remind you that it is Noon in the Pacific time zone 
#   and noonpacific.com has a new playlist out
#
#   
# Dependencies:
#   cron
cronJob = require('cron').CronJob
tz = 'America/Los_Angeles'

module.exports = (robot) ->
  # "use strict";
  its_noon_messages = [
    'It\'s Noon Pacific!'
    'Time for some new music! http://noonpacific.com'
    'Boom! http://noonpacific.com'
    'Has it been a week already?'
  ]

  itsNoonPacific = ->
    rand_message = its_noon_messages[Math.floor(Math.random() * its_noon_messages.length)]
    robot.messageRoom 'general', rand_message
    return

  new cronJob('00 00 12 * * 1', itsNoonPacific, null, true, tz)
  return