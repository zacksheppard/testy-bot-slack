// Description:
//   A cash transaction logger. Using it to suppliment mint which doesn't 
//   do a good job of this.
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

  function saveTransaction(user, amount, category){
    if (user["cash-transactions"] === undefined) {
      user["cash-transactions"] = [];
    }
    var userTransactions = user["cash-transactions"];
    var time = new Date;
    var newTransaction = {
      amount: amount,
      category: category,
      timestamp: time
    };

    userTransactions.push(newTransaction);
    robot.brain.save();
    // returns the saved transaction object from the brain 
    return userTransactions.slice(-1)[0];
  }
    
  robot.respond(/\$(\d+) (.*)/, function(msg){
    var amount = msg.match[1];
    var category = msg.match[2];
    var id = msg.message.user.id
    var user = robot.brain.userForId(id);

    var transaction = saveTransaction(user, amount, category);
    msg.send(
      "Got it. You spent $"+ transaction.amount + 
      " on " + transaction.category + 
      " at " + transaction.timestamp + "." 
    );
  });

  robot.respond(/\$ all/, function(msg){
    var transactions = getTransactions(msg);
    var transactionsLength = transactions.length;
    var response = "";
    for (var i = 0; i < transactionsLength; i++ ){
      response += "[" + transactions[i].timestamp + "] $" + 
      transactions[i].amount + " on " + 
      transactions[i].category + ".\n";
    }
    msg.send(response);
  });

}