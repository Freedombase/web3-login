# Changelog

## Next - Unreleased

### Breaking changes

### New features

### Fixes

## v0.4.0 - 2023/04/28

### New features
* Updated dependencies
* Import scripts for wallets are now async and deferred for faster loading

### Fixes
* Fix `fortmatic` typos

## v0.3.2 - 2022/05/12

### Fixes
* `web3` & `web3modal` packages are no longer imported dynamically, but via `Npm.depends` since these are the core required packages

## v0.3.0 & v0.3.1 - 2022/05/11

### Breaking changes
* Instead of just `loginMessage`, `loginWithWeb3` now accepts options object

### New features
* There is a default login message set for `loginWithWeb3`

### Fixes
* Improved login handler to reduce round trip back to client when new user needs to be created.
* v0.3.1 was published as v0.3 has some issues with publishing

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
