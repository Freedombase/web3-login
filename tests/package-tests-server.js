// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from 'meteor/tinytest'
import { check } from 'meteor/check'

import { ethCheck } from 'meteor/freedombase:web3-login'

Tinytest.add('freedombase:web3-login - server', function (test) {
  test.equal(check('0xFfA04869c1021d4b173047A774fC00d9ABA78818', ethCheck), true)
})
