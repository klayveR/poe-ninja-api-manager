# poe-ninja-api-manager
[![NPM version](https://img.shields.io/npm/v/poe-ninja-api-manager.svg)](https://www.npmjs.com/package/poe-ninja-api-manager)
[![NPM Downloads](https://img.shields.io/npm/dt/poe-ninja-api-manager.svg)](https://www.npmjs.com/package/poe-ninja-api-manager)
[![NPM License](https://img.shields.io/npm/l/poe-ninja-api-manager.svg)](https://www.npmjs.com/package/poe-ninja-api-manager)

## Contents

- [Changelog](https://github.com/klayveR/poe-ninja-api-manager/blob/master/CHANGELOG.md)
- [Getting Started](#getting-started)
- [Methods](#methods)

## Getting Started
**Install with npm:**
```bash
$ npm install poe-ninja-api-manager
```

**Usage:**
```javascript
var NinjaAPI = require("poe-ninja-api-manager");

var ninjaAPI = new NinjaAPI({
    league: "Incursion"
});

ninjaAPI.load(function(err, data) {
  var shavs = ninjaAPI.getItem("Shavronne's Wrappings", {links: 6});

  // Do something with this data
  console.log("Shavronne's Wrappings (6-link) is worth " + shavs.chaosValue + " Chaos in Incursion league");
})
```

## Methods

### Constructor([options])
- `options` - An optional object containing some of the following options
    - `league` - Set the league you want to get data from
    	- default: `Standard`
    - `loadOnStart` - Loads previously saved data from a local file. The data will be loaded *synchronously*, so don't use this is you want to avoid blocking at the start of your application.
      - default: `false`

Constructs a new `NinjaAPI`.

### update([options][, callback])
- `options` - An optional object containing some of the following options
    - `league` - Set a specific league you want to get data from, overrides the league set in the constructor
    - `save` - Saves the data to a local file after the update finished
      - default: `true`
    - `delay` - Delay in ms after each API call
      - default: `200`
- `callback` - An optional callback called when the update finishes
  - `error` - If something went wrong, throw this
  - `data` - An object containing data about failed and completed requests and the save status

This method fetches all the data for a single league from poe.ninja.

### get()
Returns the full poe.ninja data set (obviously, you must load or update before to receive anything).

### getItem(name[, options])
- `name` - Name of the item
- `options` - An optional object containing some of the following options
    - `league` - Set a specific league you want to get the item from, overrides the league set in the constructor
    - `links` - Links of the item (usually only used for body armours or weapons)
      - Possible values: `0`, `5`, `6`, everything else will default to `0`

This method returns item information about any item which you could also find on poe.ninja (obviously, you must load or update before to receive anything).

### save([callback])
- `callback` - An optional callback
  - `error` - If something went wrong, throw this
  - `success` - `true` if data was successfully saved

Saves poe.ninja data to a local file, so it can be loaded at a later time.

### load([callback])
- `callback` - An optional callback
  - `error` - If something went wrong, throw this
  - `success` - `true` if data was successfully saved

Loads poe.ninja data from a local file.

### setLeague(league)
- `league` - Change the league you want to get data from

Sets the league that should be used as default.

### getLeagues([callback])
- `callback` - An optional callback
  - `error` - If something went wrong, throw this
  - `data` - An array containing all the available leagues

Returns all the available leagues.

### updateLeagues([options][, callback])
- `options` - An optional object containing some of the following options
    - `save` - Saves the data to a local file after the update finished
      - default: `true`
- `callback` - An optional callback called when the update finishes
  - `error` - If something went wrong, throw this
  - `data` - An object containing all the leagues in an array and the save status

This method fetches all the leagues from the GGG API.

### saveLeagues([callback])
- `callback` - An optional callback
  - `error` - If something went wrong, throw this
  - `success` - `true` if data was successfully saved

Saves league data to a local file, so they can be loaded at a later time.

### loadLeagues([callback])
- `callback` - An optional callback
  - `error` - If something went wrong, throw this
  - `success` - `true` if data was successfully saved

Loads league data from a local file.
