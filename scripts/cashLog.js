// Description:
//   Logs my cash spent. Mint captures a lot but not my cash.
//   
//

//   
// Dependencies: 
//  
//   
// Commands:
//   
//   hubot $5 cupcakes - Saves a transaction for $5 with category cupcakes
//   hubot $ all - Shows all transactions in brain
//   

module.exports = function(robot){

  function getTransactions(msg){
    var id = msg.message.user.id
    var user = robot.brain.userForId(id);
    var transactions = user["cash-transactions"] || [];
    return transactions;
  }

  function saveTransaction(user, amount, category, time){
    if (user["cash-transactions"] === undefined) {
      user["cash-transactions"] = [];
    }
    var userTransactions = user["cash-transactions"];

    var time = new Date;
    var newTransaction = {
      amount: amount,
      category: category,
      time: time
    };

    userTransactions.push(newTransaction);
    robot.brain.save();
    return userTransactions;
  }
    
  robot.respond(/\$(\d+) (.*)/, function(msg){

    var amount = msg.match[1];
    var category = msg.match[2];

    var id = msg.message.user.id
    var user = robot.brain.userForId(id);

    var transactions = saveTransaction(user, amount, category);
    msg.send("Got it. You spent $"+ transactions.slice(-1)[0]['amount'] + " on " + transactions.slice(-1)[0]['category'] + " at " + transactions.slice(-1)[0]['time'] + "." );
  });

  robot.respond(/\$ all/, function(msg){
    var transactions = getTransactions(msg);
    var transactionsLength = transactions.length;
    var response = "";
    for (var i = 0; i < transactionsLength; i++ ){
      response += "[" + transactions[i]['time'] + "] $" + transactions[i]['amount'] + " on " + transactions[i]['category'] + ".\n";
    }
    msg.send(response);
  });
  
  robot.respond(/\$ delete all/, function(msg){

    var id = msg.message.user.id
    var user = robot.brain.userForId(id);
    user["cash-transactions"] = [];
    
    msg.send("Transactions deleted" + user["cash-transactions"]);
  });

}