import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { check } from 'meteor/check'
import { ethCheck } from '../common'
import '../common/index'

Accounts.registerLoginHandler('web3', (options) => {
  if (!options.web3Address) return undefined

  check(options, {
    web3Address: ethCheck
  })

  const user = Meteor.users.findOne(
    { 'services.web3.address': options.web3Address },
    {
      projection: {
        _id: 1,
        'options.services.web3': 1,
        'options.services.2fa': 1
      }
    }
  )
  if (!user) {
    // @ts-ignore
    Accounts._handleError('User not found')
  }

  // TODO 2FA

  return {
    userId: user._id
  }
})

// Add index for our service
Meteor.users.createIndex('services.web3.address', {
  unique: true,
  sparse: true
})
Meteor.users.createIndex('services.web3.id', {
  unique: true,
  sparse: true
})

Meteor.methods({
  'freedombase:createWeb3User': function (ethAddress: string) {
    check(ethAddress, ethAddress)

    // Create new user
    // @ts-ignore
    Accounts.insertUserDoc(
      {},
      {
        username: ethAddress,
        services: {
          web3: {
            id: ethAddress,
            address: ethAddress,
            verified: false
          }
        }
      }
    )

    // Logging the new user in
    // @ts-ignore
    const result = Accounts._runLoginHandlers('web3', {
      web3Address: ethAddress
    })

    // @ts-ignore
    return Accounts._attemptLogin(this, 'login', arguments, result)
  }
})
