# Changelog

## Next - Unreleased

### Breaking changes

### New features

### Fixes

## v0.2.2 - 2022/05/10

### Fixes
* Fix user not being logged in after account creation

## v0.2.1 - 2022/05/10

### Fixes
* Fix import/export issue

## v0.2.0 - 2022/05/10

### Breaking changes

* Potentially breaking: Added signatures to login process

### New features

* Added signatures to login process
* Added `verifyUserLogin`, which is lighter version of `verifyUserAction` which verifies user wallet via signature, but
  without checking against the wallet address saved in the DB, this is so that we can confirm a sign when user is
  signing up.

## v0.1.0 - 2022/05/09

### New features

* Added function to verify user's address/action called `verifyUserAction`
* Updated dependencies to the latest versions

## v0.0.2 - 2022/4/2

### New Features

* Switched to TypeScript
* Ethereum address validation added to check
* Automatically adding `script` tags for the needed libraries based on settings

## v0.0.1 - 2022/4/2

* Initial Alpha release
