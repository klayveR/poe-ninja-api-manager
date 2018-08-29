# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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
