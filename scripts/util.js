
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
  },

  formatLocation: function(location){
    // Matches: 11222, Brooklyn, ny , 11222
    var formattedLocation = {};
    var city, state, country, postalCode;
    var loc = location.split(',');
    if( loc.length === 3){
      formattedLocation.city = loc[0];
      formattedLocation.state = loc[1];
      formattedLocation.country = loc[2];
    } else if (loc.length === 2){
      formattedLocation.city = loc[0];
      formattedLocation.state = loc[1];
    } else if (!isNaN(loc)){
      formattedLocation.postalCode = loc[0];
    } else {
      formattedLocation.city = loc[0];
    }
    return formattedLocation;
  },
  
  formatTime: function(time){
    // parses these formats: 9am, 10:50 pm, 1023pm, 10:23 am, 12pm, 2200
    // parsedTime[1] is hour,[2] is minutes, [3] is am/pm
    var parsedTime = /^([0-9]{0,2}):*([0-9]{0,2})\s*(am|pm)*/.exec(time);

    if (parsedTime[2] === ''){
      parsedTime[2] = '00';
    }

    if (parsedTime[3] === 'pm') {
      parsedTime[1] = parseInt(parsedTime[1]) + 12;
    }

    if (parsedTime[1] > 12) {
      parsedTime[3] = 'pm';
    }
    return parsedTime;
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
