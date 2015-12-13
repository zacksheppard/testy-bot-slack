
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
  hello: function (){
    return 'Hello there.';
  }

};
