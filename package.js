/* global Package */
Package.describe({
  name: 'freedombase:web3-login',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Login with Web3 modal',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/Freedombase/web3-login',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
})

Package.onUse(function (api) {
  api.versionsFrom('2.6')
  api.use(['ecmascript', 'accounts-base', 'check'])
  api.mainModule('./client/index.js', 'client')
  api.mainModule('./server/index.js', 'server')
})

Package.onTest(function (api) {
  api.use('ecmascript')
  api.use('tinytest')
  api.use('template-package')
  api.mainModule('./tests/package-tests-client.js', 'client')
  api.mainModule('./tests/package-tests-server.js', 'server')
})
