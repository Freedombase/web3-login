import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { check, Match } from 'meteor/check'

// eth address validation
export const ethCheck = Match.Where((input: string) => {
  check(input, String)
  return /^(0x)[0-9a-f]{40}$/i.test(input)
})

Accounts.registerLoginHandler('web3', (options) => {
  if (!options.web3Address) return undefined

  check(options, {
    web3Address: ethCheck
  })

  const user = Meteor.users.findOne(
    { 'services.web3.address': options.web3Address },
    {
      fields: { _id: 1, 'options.services.web3': 1, 'options.services.2fa': 1 }
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

    // Loging the new user in
    // @ts-ignore
    const result = Accounts._runLoginHandlers('web3', {
      web3Address: ethAddress
    })

    // @ts-ignore
    return Accounts._attemptLogin(this, 'login', arguments, result)
  }
})
