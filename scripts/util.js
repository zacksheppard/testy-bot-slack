
module.exports = {

  // lets you check to see if a property exists in a nested object.
  // to check for school.teacher.students 
  // checkNestedProperties(school, 'teacher', 'students')
  checkNestedProperties: function(obj) {
    var args = Array.prototype.slice.call(arguments, 1);

    for (var i = 0; i < args.length; i++) {
      if (!obj || !obj.hasOwnProperty(args[i])) {
        return false;
      }
      obj = obj[args[i]];
    }
    return true;
  }

  // list_results: function(data, location){
  //   var results = data.response.results;
  //   var response = 'More than one result for ' + location + '. Prob better to *use zip code* until Zack programs me to choose one. Here\'s what I found, fwiw: \n';
  //   for (var i = 0; i < results.length; i++) {
  //     var result = '* ' + results[i].city + ', ' + results[i].state + ', ' + results[i].country + '\n'; 
  //     response += result;
  //   }
  //   return response;
  // }

};
