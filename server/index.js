import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { check } from 'meteor/check'

// TODO eth address validation

Accounts.registerLoginHandler('web3', (options) => {
  if (!options.web3Address) return undefined

  check(options, {
    web3Address: String
  })

  const user = Meteor.users.findOne(
    { 'services.web3.address': options.web3Address },
    {
      fields: { _id: 1, 'options.services.web3': 1, 'options.services.2fa': 1 }
    }
  )
  if (!user) {
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
  'freedombase:createWeb3User': function (ethAddress) {
    check(ethAddress, String)

    // Create new user
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

    // Loging the new user in
    const result = Accounts._runLoginHandlers('web3', {
      web3Address: ethAddress
    })

    return Accounts._attemptLogin(this, 'login', arguments, result)
  }
})
