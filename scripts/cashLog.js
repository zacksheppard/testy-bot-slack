// Description:
//   Logs my cash spent. Mint captures a lot but not my cash.
//   
//

//   
// Dependencies:
//   

module.exports = function(robot){

  function getTransactions(msg){
    var id = msg.message.user.id
    var user = robot.brain.userForId(id);
    
    return user["cash-transactions"];
  }

  function saveTransaction(user, amount, category, time){
    var transactions = user["cash-transactions"] || [];
    var newTransaction = {
      amount: amount,
      category: category
    };

    transactions.push(newTransaction);
    robot.brain.save();
  }
    
  robot.respond(/\$(\d+) (.*)/, function(msg){

    var amount = msg.match[1];
    var category = msg.match[2];

    var id = msg.message.user.id
    var user = robot.brain.userForId(id);

    saveTransaction(user, amount, category);
    msg.send("Got it. You spent $"+ user["cash-transactions"].slice(-1)[0]['amount'] + " on " + user["cash-transactions"].slice(-1)[0]['category'] + "." );
  });

  robot.respond(/get cash/, function(msg){
    var transactions = getTransactions(msg);
    var transactionsLength = transactions.length;
    var response = "";
    for (var i = 0; i < transactionsLength; i++ ){
      response += "You spent $" + transactions[i]['amount'] + " on " + transactions[i]['category'] + ".\n";
    }
    msg.send(response);
  });
}