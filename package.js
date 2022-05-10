/* global Package */
Package.describe({
  name: 'freedombase:web3-login',
  version: '0.2.2',
  // Brief, one-line summary of the package.
  summary: 'Login & verification with Web3 modal',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/Freedombase/web3-login',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
})

Npm.depends({
  '@metamask/eth-sig-util': '4.0.1'
})

Package.onUse(function (api) {
  api.versionsFrom('2.7')
  api.use(['ecmascript', 'accounts-base', 'check', 'typescript'])
  api.mainModule('./client/index.ts', 'client')
  api.mainModule('./server/index.ts', 'server')
  api.addFiles('./client/importScripts.ts', 'client')
})

Package.onTest(function (api) {
  api.use('ecmascript')
  api.use('tinytest')
  api.use('freedombase:web3-login')
  api.mainModule('./tests/package-tests-client.js', 'client')
  api.mainModule('./tests/package-tests-server.js', 'server')
})
