# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

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
- This project no longer adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html), because at this rate this project would be at version 42.0.0 in three days. I'd still say this is a minor change ;)

## [0.1.1] - 2018-08-26
### Fixed
- Fixed a bug where the methods `getItem()`, `update()` and `updateLeagues()` would not call back when no arguments were passed

## [0.1.0] - 2018-08-26
### Added
- Initial release

[0.2.2]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.2.2
[0.2.1]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.2.1
[0.2.0]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.2.0
[0.1.1]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.1.1
[0.1.0]: https://www.npmjs.com/package/poe-ninja-api-manager/v/0.1.0
