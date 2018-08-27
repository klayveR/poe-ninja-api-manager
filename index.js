const request = require('request');
const fs = require("fs");

function NinjaAPI(args) {
  args = args || {};

  var self = this;
  this.data = {};
  this.leagues = [];
  this.links = {
    currency: ["Currency", "Fragment"],
    item: ["DivinationCard", "Prophecy", "SkillGem", "Essence", "UniqueMap", "Map", "UniqueJewel", "UniqueFlask", "UniqueWeapon", "UniqueArmour", "UniqueAccessory"]
  }

  this.league = args.league || "Standard";
  this.loadOnStart = args.loadOnStart || false;
  this.path = args.path || './';

  // Load data synchronously, so the script can start getting items immediately
  if(this.loadOnStart) {
    if (fs.existsSync(this.path + 'ninjaData.json')) {
      var contents = fs.readFileSync(this.path + 'ninjaData.json', 'utf8');
      try {
        this.data = JSON.parse(contents);
      } catch (e) {
        console.log("Couldn't load on start, no valid JSON data");
      }
    } else {
      console.log("Couldn't load on start, no local data file found");
    }
  }
}

// Gets the correct callback function or returns null
function getCallback(args, callback) {
  if (typeof args === 'function') {
    return args;
  } else if (typeof callback === 'function') {
    return callback;
  }
  return null;
}

// Updates the poe.ninja dataset and saves it
NinjaAPI.prototype.update = function(args, callback) {
  callback = getCallback(args, callback);
  var self = this;

  var league = this.league, save = true, delay = 200;
  if(args && typeof args !== 'function') {
    league = args.league || this.league;
    save = args.save || true;
    delay = args.delay || 200;
  }

  var count = 0;
  var requests = {success: [], failed: []};
  var requestCount = this.links.currency.length + this.links.item.length;

  // Reset the league data
  this.data[league] = {};

  // Go through each type of JSON formats, which should be currencies and items
  for(var apiType in this.links) {
    // Go through each type of the API types (e.g. currency, fragments in currencies and armours, maps, ... in items)
    this.links[apiType].forEach(function(type) {
      count++; // Count up to calculate delay

      // Build correct API link
      var apiLink = "http://poe.ninja/api/data/" + apiType + "overview?league=" + league + "&type=" + type;

      // Variables that need to be accessed in the request callback are stored in here and binded to the callback
      var reqData = {self: self, apiLink: apiLink, apiType: apiType, type: type}

      setTimeout(function() {
        // Request currency data from poe.ninja
        request(apiLink, {json: true}, function(err, res, body) {
          // I pretty much declare the variables from above again, otherwise I won't be able to read this code in 2 weeks
          var apiType = reqData.apiType;
          var self = reqData.self;
          var type = reqData.type;

          if (err) {
            // If the body is invalid, request failed
            requests.failed.push(type);
          } else {
            // Make sure it's a valid ninja API with a body and elements in it
            if(body !== undefined
              && body.hasOwnProperty('lines')
              && Object.keys(body.lines).length !== 0) {
                // Add type of item as a new key if not existing
                if(!self.data[league].hasOwnProperty(apiType))
                self.data[league][apiType] = [];

                // Iterate through each item
                for (var index in body.lines) {
                  var item = body.lines[index];

                  // Add item as new element
                  self.data[league][apiType].push(item);
                }

                // Currency APIs will also send a currencyDetails object, which should be saved here. This data is not specific to a league
                // This data will always be updated if it doesn't exist or differs from the previously saved currency details
                if(body.hasOwnProperty('currencyDetails')
                && Object.keys(body.currencyDetails).length !== 0) {
                  // Add currencyDetails as a new key if not existing
                  if(!self.data.hasOwnProperty('currencyDetails'))
                  self.data['currencyDetails'] = {};

                  var currencyDetails = {};

                  // Iterate through each item
                  for (var index in body.currencyDetails) {
                    var item = body.currencyDetails[index];

                    // Add currency as new element, set name as key
                    currencyDetails[item.name] = item;
                  }

                  // Compare the new currency details to the saved ones, if they don't differ don't update
                  if(JSON.stringify(currencyDetails) !== JSON.stringify(self.data.currencyDetails)) {
                    self.data.currencyDetails = currencyDetails;
                  }
                }

                // Save as successful request
                requests.success.push(type);


              } else {
                // If the body is invalid, save as failed request
                requests.failed.push(type);
              }
            }

            // Check if all requests have been made
            if(requests.success.length + requests.failed.length >= requestCount) {
              // If every request failed
              if(requests.failed.length === requestCount) {
                if(callback && typeof callback === 'function') {
                  callback(new Error("No data could be fetched from poe.ninja. Either poe.ninja is down or '" + league + "' is not a valid league. Use the getLeagues method to get a list of supported leagues."), {requests: requests, save: {success: false, error: null}});
                }
              } else {
                // Save to file if passed in args
                if(save) {
                  self.save(function(err, success) {
                    if(callback && typeof callback === 'function') {
                      callback(null, {requests: requests, save: {success: success, error: err}});
                    }
                  });
                } else {
                  if(callback && typeof callback === 'function') {
                    callback(null, {requests: requests, save: {success: false, error: null}});
                  }
                }
              }
            }
          }.bind(reqData));
        }, delay * count);
      });
    }
  }

  // Returns data for an item by name
  NinjaAPI.prototype.getItem = function(name, args) {
    var league = this.league, links = 0;
    if(args !== undefined && typeof args !== 'function') {
      league = args.league || this.league;
      links = args.links || 0;
    }
    
    var match = {};

    // Set links to 0 if between 1-4 or higher than 6 links, because poe.ninja doesn't have data for those
    if((links > 0 && links < 5) || links > 6) links = 0;

    if(name !== "" && this.data.hasOwnProperty(league) && this.data[league].hasOwnProperty('item') && this.data[league].hasOwnProperty('currency')) {
      // Match every item that has the name in currency
      var currency = this.data[league].currency.filter(function (item) { return item.currencyTypeName == name });
      // Match every item that has the name in items
      var item = this.data[league].item.filter(function (item) { return item.name == name });
      // Filter links
      item = item.filter(function (item) { return item.links == links });
      // Filter out foil items, I'll implement support for those later
      item = item.filter(function (item) { return item.itemClass != 9 });

      // Determine which of the above 3 matches
      if(item.length > 0) {
        match = item[0];
        match['apiType'] = 'item';
      } else if(currency.length > 0) {
        match = currency[0];
        match['apiType'] = 'currency';
      }
    }

    return match;
  }

  // Returns the current dataset
  NinjaAPI.prototype.get = function() {
    return this.data;
  }

  // Returns details for a currency
  NinjaAPI.prototype.getCurrencyDetails = function(name) {
    if(this.data.hasOwnProperty('currencyDetails')) {
      if(this.data.currencyDetails.hasOwnProperty(name)) {
        return this.data.currencyDetails[name];
      }
    }
    return {};
  }

  // Returns true if there is data for league
  NinjaAPI.prototype.hasDataForLeague = function(league) {
    if(this.data.hasOwnProperty(league)) {
      return true;
    }
    return false;
  }

  // Returns all leagues, if not loaded try to load, if not loadable attempt to update
  // This functions feels messy, but I can't be bothered to clean it up right now. It's a mostly useless feature anyways
  NinjaAPI.prototype.getLeagues = function(callback) {
    return this.leagues;
  }

  // Sets the league to use as default
  NinjaAPI.prototype.setLeague = function(league) {
    if(league !== "" && typeof league == "undefined") {
      this.league = league;
    }
  }

  // Updates the league from the official GGG API
  NinjaAPI.prototype.updateLeagues = function(args, callback) {
    callback = getCallback(args, callback);

    var self = this;
    if(args && typeof args !== 'function') {
      var save = args.save || true;
    }
    request('http://api.pathofexile.com/leagues?type=main', {json: true}, function(err, res, body) {
      if (err) { callback(err); return; }

      var leaguesCount = 0;
      // Iterate through each league
      for(var i = 0; i < body.length; i++) {
        var league = body[i];
        var ssf = false;
        leaguesCount++;

        // Check if any rule indicates that this is an SSF league
        if(league.rules.length > 0) {
          for(var j = 0; j < league.rules.length; j++) {
            if(league.rules[j].name === "Solo") {
              ssf = true;
            }
          }
        }

        // Add league if it's not SSF
        if(!ssf) {
          self.leagues.push(league.id);
        }

        // When done with every league
        if(leaguesCount === body.length) {
          // Make sure at least one league got added
          if(self.leagues.length > 0) {
            if(save) {
              self.saveLeagues(function(err, success) {
                if(callback && typeof callback === 'function') {
                  callback(null, {leagues: self.leagues, save: {success: success, error: err}});
                }
              });
            } else {
              if(callback && typeof callback === 'function') {
                callback(null, {leagues: self.leagues, save: {success: false, error: null}});
              }
            }
          } else {
            var err = new Error('Couldn\'t update leagues, no leagues were present when fetching data from the API');
            if(callback && typeof callback === 'function') {
              callback(err, {leagues: self.leagues, save: {success: false, error: err}});
            }
          }
        }
      }
    }.bind(self));
  }

  // Loads previously saved dataset from cache file
  NinjaAPI.prototype.load = function(callback) {
    // Make this usable in readFile callback
    var self = this;

    fs.readFile(this.path + 'ninjaData.json', function(err, contents) {
      if(err) {
        if(callback && typeof callback === 'function') {
          callback(err, false);
        }
        return;
      }

      self.data = JSON.parse(contents);
      callback(null, true);
    });
  }

  // Saves current dataset to cache file
  NinjaAPI.prototype.save = function(callback) {
    fs.writeFile(this.path + 'ninjaData.json', JSON.stringify(this.data, null, 4), (err) => {
      if (err) {
        if(callback && typeof callback === 'function') {
          callback(err, false);
        }
      }

      if(callback && typeof callback === 'function') {
        callback(null, true);
      }
    });
  }

  // Sometimes it's simply easier to copy + paste your own functions even though they're basically the exact same :o)
  // Loads saved leagues from cache file
  NinjaAPI.prototype.loadLeagues = function(callback) {
    // Make this usable in readFile callback
    var self = this;

    fs.readFile(this.path + 'leagues.json', function(err, contents) {
      if(err) {
        if(callback && typeof callback === 'function') {
          callback(err, false);
        }
        return;
      }

      self.leagues = JSON.parse(contents);
      callback(null, true);
    });
  }

  // Saves current leagues to cache file
  NinjaAPI.prototype.saveLeagues = function(callback) {
    fs.writeFile(this.path + 'leagues.json', JSON.stringify(this.leagues, null, 4), (err) => {
      if (err) {
        if(callback && typeof callback === 'function') {
          callback(err, false);
        }
      }

      if(callback && typeof callback === 'function') {
        callback(null, true);
      }
    });
  }

  module.exports = NinjaAPI;
