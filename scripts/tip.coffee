# Description:
#   Tip calculator
#

module.exports = (robot) ->

  robot.respond /tip \$*(\d+\.*\d{0,2})/i, (res) ->
    bill = res.match[1]
    tip10 = Math.ceil(bill * .10)
    tip15 = Math.ceil(bill * .15)
    tip20 = Math.ceil(bill * .20)
    res.send "Rounded up to the nearest dollar, \n
      10%: _$#{tip10}_ \n
      15%: _$#{tip15}_ \n
      20%: _$#{tip20}_"