import { check, Match } from 'meteor/check'
import { Meteor } from 'meteor/meteor'
import { recoverPersonalSignature } from '@metamask/eth-sig-util'

// eth address validation
export const ethCheck = Match.Where((input: string) => {
  check(input, String)
  return /^(0x)[0-9a-f]{40}$/i.test(input)
})

Meteor.methods({
  'freedombase:verifyWeb3User': function (
    signature: string,
    message: string,
    recordVerification = true
  ) {
    check(signature, String)
    check(message, String)
    check(recordVerification, Match.Maybe(Boolean))

    // Verify that the current user has this eth address assigned
    const userId = this.userId
    const user = Meteor.users.findOne(userId, {
      projection: { 'services.web3': 1 }
    })
    const usersEthAddress = user.services.web3.address

    const verificationType =
      Meteor.settings?.public?.packages?.['freedombase:web3-login']
        ?.verificationType || 'personal_sign'

    let verified = false

    switch (verificationType) {
      case 'personal_sign':
        try {
          const recoveredAddress = recoverPersonalSignature({
            data: message,
            signature
          })
          // TODO investigate why recovered addresses are always in lower case
          if (recoveredAddress === usersEthAddress.toLowerCase()) {
            // Success
            verified = true
            if (recordVerification) {
              Meteor.users.update(userId, {
                $set: {
                  'services.web3.verified': true,
                  'services.web3.verifiedAt': new Date()
                }
              })
            }
          }
        } catch (e) {
          throw new Meteor.Error('500', 'Verification failed!')
        }
        break
      default:
        throw new Meteor.Error('500', 'Verification method not specified!')
    }

    return verified
  }
})
