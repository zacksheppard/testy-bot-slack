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
    var transactions = user["cash-transactions"] || [];
    console.log("1 saveTransaction");
    console.log(transactions);
    console.log("user['cash-transactions']");
    console.log(user["cash-transactions"]);
    var time = Date.now();
    var newTransaction = {
      amount: amount,
      category: category,
      time: time
    };

    transactions.push(newTransaction);
    robot.brain.save();
    console.log("2 saveTransaction");
    console.log(transactions);
    return transactions;
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
    console.log(transactions);
    console.log(transactionsLength);
    var response = "";
    for (var i = 0; i < transactionsLength; i++ ){
      response += "You spent $" + transactions[i]['amount'] + " on " + transactions[i]['category'] + ".\n";
    }
    console.log(response);
    msg.send(response);
  });
}