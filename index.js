const request = require("request-promise-native");
const fs = require("fs");
const path = require("path");
const _ = require("underscore");

const Helpers = require("./modules/helpers.js");

class NinjaAPI {
  /**
  * Creates a new NinjaAPI object
  *
  * @constructor
  * @param {Object} [options] An optional options object
  * @param {string} [options.league=Standard] League that should be used as default
  * @param {string} [options.path=./] Path where data should be saved
  * @param {string} [options.dataFile=ninjaData.json] File in which data should be saved
  */
  constructor(options) {
    var defaultOptions = {
        league: "Standard",
        path: "./",
        dataFile: "ninjaData.json"
    };

    this.updating = false;
    this.options = _.extend(defaultOptions, options);
    this.saveFile = path.join(this.options.path, this.options.dataFile);
    this.data = {};
    this.apis = [
      {overview: "currency", type: "Currency"},
      {overview: "currency", type: "Fragment"},
      {overview: "item", type: "DivinationCard"},
      {overview: "item", type: "Prophecy"},
      {overview: "item", type: "SkillGem"},
      {overview: "item", type: "Essence"},
      {overview: "item", type: "UniqueMap"},
      {overview: "item", type: "Map"},
      {overview: "item", type: "UniqueJewel"},
      {overview: "item", type: "UniqueFlask"},
      {overview: "item", type: "UniqueWeapon"},
      {overview: "item", type: "UniqueArmour"},
      {overview: "item", type: "UniqueAccessory"},
      {overview: "item", type: "Fossil"},
      {overview: "item", type: "Resonator"},
    ];
  }

  /**
  * Updates data from poe.ninja for a specific league.
  *
  * @param {Object} [options] An optional options object
  * @param {string} [options.league=Standard] League that should be updated
  * @param {string} [options.delay=200] Delay between API calls
  * @returns {Promise}
  * @fulfil {Array} - An array of objects containing the requested data of each API
  * @reject {Error} - The `error.message` contains information about why the promise was rejected
  */
  update(options) {
    var self = this;
    var defaultOptions = {
        league: this.options.league,
        delay: 200
    };

    options = _.extend(defaultOptions, options);

    this._resetLeagueData(options.league);

    return new Promise(function(resolve, reject) {
      if(!self.updating) {
        self.updating = true;
        var promises = self._getRequestCallsArray(options.league, options.delay);

        Promise.all(promises)
        .then((result) => {
          self._storeApiData(result);
          return resolve(result);
        })
        .catch((error) => {
          return reject(error);
        })
        .then(() => {
          self.updating = false;
        });
      } else {
        return reject(new Error("Update is already in progress"));
      }
    });
  }

  /*
  * Requests data from an API
  */
  _requestApiData(api, league, delay) {
    var self = this;
    var url = Helpers.buildApiUrl(api.overview, api.type, league);

    return new Promise(function(resolve, reject) {
      // Request the API
      setTimeout(function() {
        request(url, {json: true, headers:{'Connection': 'keep-alive'}})
        .then((contents) => {
          return self._processRequest(contents, api, league, resolve, reject);
        })
        .catch((error) => {
          return reject(error);
        })
      }, delay);
    });
  }

  /*
  * Processes a request
  */
  _processRequest(contents, api, league, resolve, reject) {
    if(Helpers.isValidNinjaApi(contents)) {
      var result = {
        data: contents,
        api,
        league
      };

      resolve(result);
    } else {
      reject(new Error("The data from the requested " + api.type + " API (League: " + league + ") could not be processed because the format is invalid or the response is empty. Possible reasons: 1) Invalid league name, 2) poe.ninja is down, 3) poe.ninja changed their API structure"));
    }
  }

  /*
  * Processes the data from an API
  */
  _storeApiData(result) {
    for(var i = 0; i < result.length; i++) {
      var data = result[i];
      this._addItemsToData(data.data, data.league, data.api);
      this._updateCurrencyDetails(data.data);
    }
  }

  /*
  * Returns an array of functions containing calls to every API update
  */
  _getRequestCallsArray(league, delay) {
    var promises = [];

    for(var i = 0; i < this.apis.length; i++) {
      var api = this.apis[i];
      var method = this._requestApiData(api, league, delay * i);

      promises.push(method);
    }

    return promises;
  }

  /*
  * Adds currency details to the data object if the data differs from the old data
  */
  _updateCurrencyDetails(data) {
    if(Helpers.hasCurrencyDetailsData(data)) {
      this._addKeyToData("CurrencyDetails");

      // Check if the new currency details data is different from the saved one, if yes, overwrite
      if(!Helpers.isSameObject(this.data.CurrencyDetails, data.currencyDetails)) {
        this.data.CurrencyDetails = data.currencyDetails;
      }
    }
  }

  /*
  * Adds an item to the data object under the corresponding league and type key
  */
  _addItemsToData(data, league, api) {
    // Add keys if necessary
    this._addKeyToData(league);
    this._addKeyToLeagueData(league, api.type);

    this.data[league][api.type] = data.lines;
  }

  /*
  * Adds a new key to the league object inside the data object
  */
  _addKeyToLeagueData(league, type) {
    if(!this.data[league].hasOwnProperty(type)) {
      this.data[league][type] = {};
      return true;
    }

    return false;
  }

  /*
  * Adds a new key to the data object
  */
  _addKeyToData(key) {
    if(!this.data.hasOwnProperty(key)) {
      this.data[key] = {};
      return true;
    }

    return false;
  }

  /**
  * Returns data for an item from the currently loaded poe.ninja data object.
  * The returned item object is the same you'd receive from poe.ninja, but it has an additional property `apiType`.
  * The optional options do no apply for currency items, except for `options.league`.
  *
  * @param {String} name Name of the item
  * @param {Object} [options] An optional options object
  * @param {string} [options.league=Standard] League that should be searched
  * @param {string} [options.links=0] Links the item should have
  * @param {string} [options.variant=null] Variant of the item. If no variant is specified, any variant of the item will be returned, but preferably the default (`null` variant) of the item
  * @param {string} [options.fallbackVariant=null] If a variant was specified but not found, try to find this instead. Useful for defaulting gems to the level 20 variant
  * @param {string} [options.relic=false] Set to `true` for the relic version of the item
  * @param {string} [options.baseType=null] Base type of the item. Is ignored if not specified
  * @returns {Promise}
  * @fulfil {Array} - An array containing the matching item as an object. If you receive multiple objects, please open an issue.
  * @reject {Error} - The `error.message` contains information about why the promise was rejected
  */
  getItem(name, options) {
    var self = this;
    var defaultOptions = {
        league: this.options.league,
        links: 0,
        variant: null,
        fallbackVariant: null,
        relic: false,
        baseType: null,
        variantSpecified: false
    };

    if(options.hasOwnProperty("variant")) {
      options.variantSpecified = true;
    }

    options = _.extend(defaultOptions, options);

    return new Promise(function(resolve, reject) {
      var matches = self._getItemMatches(name, options);

      if(matches.length === 0) {
        reject(new Error("No item found for your query"));
      } else {
        resolve(matches);
      }
    });
  }

  /*
  * Iterates through every API type and returns the match after first match found
  */
  _getItemMatches(name, options) {
    if(this._hasDataForLeague(options.league)) {
      for(var type in this.data[options.league]) {
        var matches = this._getMatchesInType(type, name, options);

        if(matches.length > 0) {
          return matches;
        }
      }
    }

    return [];
  }

  /*
  * Calls the corresponding functions for finding matches in items and currency
  */
  _getMatchesInType(type, name, options) {
    var overview = Helpers.getOverviewByType(type, this.apis);
    var matches = [];

    if(this._hasDataForTypeInLeague(type, options.league)) {
      if(overview === "item") {
        matches = this._getItemMatchesInType(type, name, options);
      } else {
        matches = this._getCurrencyMatchesInType(type, name, options);
      }

      matches = Helpers.addApiTypeToMatches(type, matches);
    }

    return matches;
  }

  /*
  * Gets item matches in a specific API type
  */
  _getItemMatchesInType(type, name, options) {
    var itemArray = this.data[options.league][type];

    var matches = _.where(itemArray, {name: name, links: options.links});

    if(options.relic) {
      matches = _.filter(matches, function(item) { return (item.itemClass === 9); });
    } else {
      matches = _.filter(matches, function(item) { return (item.itemClass !== 9); });
    }

    if(options.baseType != null) {
      matches = _.where(matches, {baseType: options.baseType});
    }

    // If a variant was specified, filter for that exact variant or fallback variant
    // If no variant was specified, prefer the null variant, but return any variant if there's no null variant
    if(options.variantSpecified) {
      var variantMatches = _.where(matches, {variant: options.variant});

      if(variantMatches.length > 0) {
        matches = variantMatches;
      } else {
        var fallbackVariantMatches = _.where(matches, {variant: options.fallbackVariant});
        if(fallbackVariantMatches.length > 0) {
          matches = fallbackVariantMatches;
        } else {
          matches = variantMatches;
        }
      }
    } else {
      var nullMatches = _.where(matches, {variant: "null"});
      if(nullMatches.length === 1) {
        matches = nullMatches;
      }
    }

    return matches;
  }

  /*
  * Gets currency matches in a specific API type
  */
  _getCurrencyMatchesInType(type, name, options) {
    var currencyArray = this.data[options.league][type];

    return _.where(currencyArray, {currencyTypeName: name});
  }

  /**
  * Returns an object containing details about a currency item.
  * Returns an empty object if no data is available for the specified currency name.
  *
  * @param {string} name Name of the currency
  * @returns {object}
  */
  getCurrencyDetails(name) {
    name = name || "";

    if(this.data.hasOwnProperty("CurrencyDetails")) {
      var matches = this.data.CurrencyDetails.filter(function (item) { return item.name === name; });

      if(typeof matches !== "undefined" && matches.length > 0) {
        return matches[0];
      }
    }
    return {};
  }

  /**
  * Returns `true` if any poe.ninja data is available.
  * This means that it has been loaded or updated before calling this method.
  *
  * @param {string} [league] By setting a league, `true` will be returned if there's data for this league
  * @returns {boolean}
  */
  hasData(league) {
    if(typeof league !== "undefined") {
      return this._hasDataForLeague(league);
    }

    return Object.keys(this.data).length !== 0;
  }

  /**
  * Returns the league that is currently set as default.
  *
  * @returns {string}
  */
  getLeague() {
    return this.options.league;
  }

  /**
  * Sets a league as default.
  *
  * @param {string} league League that should be set as default
  */
  setLeague(league) {
    if(league !== "" && typeof league !== "undefined") {
      this.options.league = league;
    }
  }

  /*
  * Returns true if there"s any data for a specific league present
  */
  _hasDataForLeague(league) {
    if(this.data.hasOwnProperty(league)) {
      return true;
    }
    return false;
  }

  /*
  * Returns true if there"s any data for a specific league present
  */
  _hasDataForTypeInLeague(type, league) {
    if(this.data[league].hasOwnProperty(type)) {
      return true;
    }
    return false;
  }

  /*
  * Resets data for a specific league
  */
  _resetLeagueData(league) {
    if(this.data.hasOwnProperty(league)) {
      this.data[league] = {};
      return true;
    }
    return false;
  }

  /**
  * Loads previously saved data from file.
  *
  * @returns {Promise}
  * @fulfil {boolean} - `true` if the data was loaded successfully
  * @reject {Error} - The `error.message` contains information about why the promise was rejected
  */
  load() {
    var self = this;

    return new Promise(function(resolve, reject) {
      fs.readFile(self.saveFile, function(error, contents) {
        if(error) { reject(error); return; }

        self.data = JSON.parse(contents);
        resolve(true);
      });
    });
  }

  /**
  * Saves the currently loaded or updated data to file.
  *
  * @returns {Promise}
  * @fulfil {boolean} - `true` if the data was saved successfully
  * @reject {Error} - The `error.message` contains information about why the promise was rejected
  */
  save() {
    var self = this;

    return new Promise(function(resolve, reject) {
      fs.writeFile(self.saveFile, JSON.stringify(self.data, null, 4), (error) => {
        if(error) { reject(error); return; }

        resolve(true);
      });
    });
  }

  /**
  * Returns `true` if data is currently being updated
  *
  * @returns {boolean}
  */
  isUpdating() {
    return this.updating;
  }
}

module.exports = NinjaAPI;
