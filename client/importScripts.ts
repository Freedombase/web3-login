// Start with inserting Web3 and Web3 code
import { Meteor } from 'meteor/meteor'

function createScript(url) {
  try {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    document.body.appendChild(script)
  } catch (e) {
    console.error(e)
  }
}

// Setup additional providers
// WalletConnect
if (
  Meteor.settings.public?.packages?.['freedombase:web3-login']?.walletconnect
) {
  createScript(
    'https://unpkg.com/@walletconnect/web3-provider@1.7.8/dist/umd/index.min.js'
  )
}

// Formatic
if (Meteor.settings.public?.packages?.['freedombase:web3-login']?.formatic) {
  createScript('https://unpkg.com/fortmatic@2.2.1/dist/fortmatic.js')
}
