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
    return "https://poe.ninja/api/data/" + overview + "overview?league=" + league + "&type=" + type;
  }

  /*
  * Returns true if the object has the property and is not empty
  */
  static hasPropertyWithData(obj, prop) {
    if(typeof obj !== "undefined" && obj.hasOwnProperty(prop) && Object.keys(obj[prop]).length !== 0) {
      return true;
    }

    return false;
  }

  /*
  * Returns true if the object has the property, can be empty
  */
  static hasProperty(obj, prop) {
    if(typeof obj !== "undefined" && obj.hasOwnProperty(prop)) {
      return true;
    }

    return false;
  }

  /*
  * Returns the overview that corresponds to the item API type
  */
  static getOverviewByType(type, apis) {
    var api = apis.filter(function (api) { return api.type === type; });

    if(api.length !== 0) {
      return api[0].overview;
    }

    return "unknown";
  }

  /*
  * Returns true if an API object is valid. For poe.ninja APIs, this is true if the object has the `lines` key
  */
  static isValidNinjaApi(obj) {
    return Helpers.hasProperty(obj, "lines");
  }

  /*
  * Returns true if an API object contains currency details
  */
  static hasCurrencyDetailsData(obj) {
    return Helpers.hasPropertyWithData(obj, "currencyDetails");
  }

  /*
  * Adds the API type to matches and returns the adjusted matches array
  */
  static addApiTypeToMatches(type, matches) {
    matches = matches || [];

    for(var i = 0; i < matches.length; i++) {
      matches[i]["apiType"] = type;
    }

    return matches;
  }
}

module.exports = Helpers;
