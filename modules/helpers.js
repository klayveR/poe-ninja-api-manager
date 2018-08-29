class Helpers {
  /*
  * Sums up all the values of an object
  */
  static sumObjectValues(obj) {
    var sum = 0;
    for(var element in obj) {
      if(obj.hasOwnProperty(element) ) {
        sum += parseFloat(obj[element]);
      }
    }

    return sum;
  }

  /*
  * Compares to objects and returns true if they have the exact same content
  * This function name might be technically incorrect ;)
  */
  static isSameObject(obj1, obj2) {
    if(JSON.stringify(obj1) === JSON.stringify(obj2)) {
      return true;
    }

    return false;
  }

  /*
  * Builds the URL for an API call
  */
  static buildApiUrl(overview, type, league) {
    return 'http://poe.ninja/api/data/' + overview + 'overview?league=' + league + '&type=' + type;
  }
}

module.exports = Helpers;
