import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { check } from 'meteor/check'
import { ethCheck } from '../common'

export '../common/index'

type LoginHandlerOptions = {
  web3Address: string
}

Accounts.registerLoginHandler('web3', async (options: LoginHandlerOptions) => {
  if (!options.web3Address) return undefined

  check(options, {
    web3Address: ethCheck
  })

  const user = await Meteor.users.findOneAsync(
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
    // Create user
    const userId = await Accounts.insertUserDoc(
      {},
      {
        username: options.web3Address,
        services: {
          web3: {
            id: options.web3Address,
            address: options.web3Address,
            verified: false
          }
        }
      }
    )
    return {
      userId
    }
  }

  // TODO 2FA?

  return {
    userId: user._id
  }
})

// Add index for our service
Meteor.users.createIndexAsync('services.web3.address', {
  unique: true,
  sparse: true
})
Meteor.users.createIndexAsync('services.web3.id', {
  unique: true,
  sparse: true
})


