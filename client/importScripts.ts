// Start with inserting Web3 and Web3 code
import { Meteor } from 'meteor/meteor'

function createScript (url) {
  try {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    script.async = true
    script.defer = true
    script.rel = 'preconnect'
    document.body.appendChild(script)
  } catch (e) {
    console.error(e)
  }
}

createScript('https://unpkg.com/web3@1.9.0/dist/web3.min.js')
createScript('https://unpkg.com/web3modal@1.9.12/dist/index.js')

// Setup additional providers
// WalletConnect
if (
  Meteor.settings.public?.packages?.['freedombase:web3-login']?.walletconnect
) {
  createScript(
    'https://unpkg.com/@walletconnect/web3-provider@1.8.0/dist/umd/index.min.js'
  )
}

// Fortmatic
if (Meteor.settings.public?.packages?.['freedombase:web3-login']?.fortmatic) {
  createScript('https://unpkg.com/fortmatic@2.4.0/dist/fortmatic.js')
}
