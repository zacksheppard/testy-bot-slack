// Description:
//   Updates zack.pizza
//   
//   
// Commands:
//   
//   pizza yum! - sets last pizza date to today


module.exports = function(robot){

  robot.respond(/pizza yum*!*/, function(msg){
    
    var today = new Date();
    var todayFormatted = today.getFullYear() + '-' + 
      today.getMonth() + '-' + today.getDate();
    var url = 
      'https://' + process.env.PIZZA_FIREBASE_URL + '.firebaseio.com/.json';

    return robot.http(url)
    .put('{ "last_pizza_date": "' + todayFormatted + '" }')
    (function(err, res, body) {
      var data = JSON.parse(body);
      msg.send(
        'I set your last pizza eaten to `' + 
        data.last_pizza_date + '`. (Also, when do I get some?)'
      );
    });    
  }); 
}