// Start with inserting Web3 and Web3 code
import { Meteor } from 'meteor/meteor'

function createScript (url) {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = url
  document.body.appendChild(script)
}

createScript('https://unpkg.com/web3@1.7.1/dist/web3.min.js')
createScript('https://unpkg.com/web3modal@1.9.5/dist/index.js')

// Setup additional providers
// WalletConnect
if (
  Meteor.settings.public?.packages?.['freedombase:web3-login']?.walletconnect
) {
  createScript(
    'https://unpkg.com/@walletconnect/web3-provider@1.7.7/dist/umd/index.min.js'
  )
}

// Formatic
if (Meteor.settings.public?.packages?.['freedombase:web3-login']?.formatic) {
  createScript('https://unpkg.com/fortmatic@2.2.1/dist/fortmatic.js')
}
