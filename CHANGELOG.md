# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.7.0] - 2018-09-18
### Added
- Added `isUpdating()` method
- Added `fallbackVariant` as an option for the `getItem()` function

### Changed
- An item will now only check for the variant of an item if `options.variant` was specified when making the `getItem()` request. If a variant is specified and not found, it will either return the fallback variant or reject the promise. If no variant was specified, it will return the first match, but prefer the `null` variant.

## [0.6.8] - 2018-09-14
### Changed
- Using the `keep-alive` header for requests

## [0.6.7] - 2018-09-14
### Changed
- Requests are now being made via `https` instead of `http`

## [0.6.6] - 2018-09-04
### Added
- Added support for fossils and resonators

## [0.6.5] - 2018-09-04
### Added
- Added `baseType` as a `getItem()` option

### Changed
- If `options.variant` is set to `null` and no item is found, the items with a variant will be returned, if present. If `options.variant` is set to a variant and no item is found, the item with no variant will be returned, if present.

## [0.6.4] - 2018-09-01
### Fixed
- Now correctly joins path and file name in all cases

## [0.6.3] - 2018-09-01
### Changed
- Now using `underscore` for filtering the correct item

## [0.6.2] - 2018-09-01
### Changed
- Now using `underscore` for better management of default options

## [0.6.1] - 2018-09-01
### Changed
- If the requested poe.ninja API was valid but empty, the `update()` promise will no longer reject and throw an error. This was changed to not throw an error, because at league start some APIs (such as map APIs) can be empty, while others are starting to fill. The map data will simply remain empty until another update has data for this API.

## [0.6.0] - 2018-08-31
### Changed
- The `legacy` options of the `getItem()` options has been renamed to `relic` to avoid confusion

## [0.5.0] - 2018-08-30
### Removed
- Removed the `getData()` method because I felt it was unnecessary. If you want to get the full data object, simply require the saved file in your project.

## [0.4.4] - 2018-08-29
### Changed
- The `_getItemMatchesInType()` method now only filters once instead of multiple times
- The item object received from the `getItem()` method now contains an additional `apiType` property again

### Removed
- Removed `requests.js` as it's finally no longer in use

## [0.4.3] - 2018-08-29
### Fixed
- Fixed a promise reject with undefined variables

## [0.4.2] - 2018-08-29
### Changed
- Now using the `request-promise-native` package to promisify request calls

### Fixed
- Delay after each API call now works again

## [0.4.1] - 2018-08-29
### Changed
- The promise resolve for the `update()` method now returns the requested data objects

### Fixed
- Fixed a bug where the `save()` method would not return the promise

## [0.4.0] - 2018-08-29
### Added
- Added the following options
  - `dataFile` as a constructor option to specify a custom name for the save file
  - `legacy` as a `getItem()` option to match the legacy version of an item
  - `variant` as a `getItem()` option to match a certain variant of an item

- Added the `getLeague()` method which returns the league that was set to be used by default
- Added `dataFile` as a constructor option to specify a custom name for the save file

### Changed
- Major code refactor, due to that bugs might occur
- Now using jsdoc2md for documentation
- Methods that previously used callbacks now use promises
- The `get()` method has been renamed to `getData()`
- The `hasDataForLeague()` method has been renamed to `hasData()`. When no league is specified, it'll return true if any data is present

### Removed
- Removed the following options
  - `loadOnStart` option from the constructor options
  - `save` option from the `update()` options

- Removed the following methods as they didn't fit into this package. I'll release a new package that focuses on the league API soon.
  - `getLeagues`
  - `saveLeagues`
  - `updateLeagues`

## [0.3.3] - 2018-08-27
### Changed
- `getItem()` now returns an empty object instead of null if there's no data

## [0.3.2] - 2018-08-27
### Changed
- `getCurrencyDetails()` now returns an empty object instead of null if there's no data for the currency

## [0.3.1] - 2018-08-26
### Fixed
- `icon` and `poeTradeId` are now actually no longer properties of an item object returned by `getItem()`, which should've been the case in the previous update ;)

## [0.3.0] - 2018-08-26
### Added
- The `update()` method now also updates currency details, which contain additional currency data such as the `icon` or `poeTradeId`
- Added the `hasDataForLeague()` method which returns whether or not the data object has data for a specific league
- Added the `getCurrencyDetails()` method which returns currency details

### Changed
- The `getLeagues()` method no longer has a callback and simply returns the league data or `null` in case of invalid parameters or missing data
- `icon` and `poeTradeId` are no longer properties of an item object returned by `getItem()` if the item is a currency. Use `getCurrencyDetails()` to get them instead

## [0.2.3] - 2018-08-26
### Changed
- The object returned by the `getItem()` method now has a `apiType` property, which indicates whether the item is an item or currency

## [0.2.2] - 2018-08-26
### Added
- Added a `path` option in the constructor, defining the path to the local save files

### Fixed
- Fixed a bug where the `getItem()` method would incorrectly return legacy foil items instead of normal ones

## [0.2.1] - 2018-08-26
### Fixed
- Fixed a bug where the `getItem()` method would not return anything if no options where passed
- Fixed a bug where the `getItem()` method would return items with the wrong link count

## [0.2.0] - 2018-08-26
### Changed
- The `getItem()` method no longer has a callback and simply returns the item data or `null` in case of invalid parameters or missing data. *I have no idea why this method had a callback in the first place, it made everything more complicated than it should be. Sometimes you get really carried away, huh?*

## [0.1.1] - 2018-08-26
### Fixed
- Fixed a bug where the methods `getItem()`, `update()` and `updateLeagues()` would not call back when no arguments were passed

## [0.1.0] - 2018-08-26
### Added
- Initial release

[0.6.8]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.6.8
[0.6.7]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.6.7
[0.6.6]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.6.6
[0.6.4]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.6.4
[0.6.3]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.6.3
[0.6.2]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.6.2
[0.6.1]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.6.1
[0.6.0]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.6.0
[0.5.0]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.5.0
[0.4.4]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.4.4
[0.4.3]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.4.3
[0.4.2]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.4.2
[0.4.1]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.4.1
[0.4.0]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.4.0
[0.3.3]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.3.3
[0.3.2]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.3.2
[0.3.1]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.3.1
[0.3.0]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.3.0
[0.2.3]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.2.3
[0.2.2]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.2.2
[0.2.1]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.2.1
[0.2.0]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.2.0
[0.1.1]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.1.1
[0.1.0]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.1.0
