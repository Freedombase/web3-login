import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

export const isHttps = () => location.protocol === 'https:'

const Web3Modal = window.Web3Modal.default

// Web3modal instance
let web3Modal

// Chosen wallet provider given by the dialog window
let provider

// Address of the selected account
let selectedAccount

function init () {
  const Web3Modal = window.Web3Modal.default
  const WalletConnectProvider = window.WalletConnectProvider.default

  // Check that the web page is run in a secure context,
  // as otherwise MetaMask won't be available
  if (!isHttps()) {
    return
  }

  // Tell Web3modal what providers we have available.
  // Built-in web browser provider (only one can exist as a time)
  // like MetaMask, Brave or Opera is added automatically by Web3modal
  const providerOptions = {}
  // TODO more options
  if (
    Meteor.settings.public?.packages?.['freedombase:web3-login']
      ?.walletconnect &&
    window.WalletConnectProvider
  ) {
    providerOptions.walletconnect = {
      package: window.WalletConnectProvider?.default,
      options:
      Meteor.settings.public.packages['freedombase:web3-login'].walletconnect
    }
  }
  if (
    Meteor.settings.public?.packages?.['freedombase:web3-login']?.formatic &&
    window.Fortmatic
  ) {
    providerOptions.formatic = {
      package: window.Fortmatic,
      options:
      Meteor.settings.public.packages['freedombase:web3-login'].formatic
    }
  }

  web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
    disableInjectedProvider:
      Meteor.settings.public?.packages?.['freedombase:web3-login']
        ?.disableInjectedProvider || false // optional. For MetaMask / Brave / Opera.
  })
}

async function fetchAccountData (callback) {
  // Get a Web3 instance for the wallet
  const web3 = new Web3(provider)

  // Get list of accounts of the connected wallet
  const accounts = await web3.eth.getAccounts()

  // MetaMask does not give you all accounts, only the selected account
  selectedAccount = accounts[0]
  Accounts.callLoginMethod({
    methodArguments: [
      {
        web3Address: selectedAccount
      }
    ],
    userCallback: (error, result) => {
      if (error) {
        if (error.error === 403 && error.reason === 'User not found') {
          // Create a new user
          Meteor.call(
            'freedombase:createWeb3User',
            selectedAccount,
            (error, response) => callback(error, response)
          )
        } else {
          if (callback) {
            callback(error)
          } else {
            throw new Meteor.Error(error)
          }
        }
      } else {
        callback && callback()
      }
    }
  })
  return { 'services.web3.address': selectedAccount }
}

/**
 * Fetch account data for UI when
 * - User switches accounts in wallet
 * - User switches networks in wallet
 * - User connects wallet initially
 */
async function refreshAccountData (callback) {
  await fetchAccountData(callback)
}

export const loginWithWeb3 = async (callback) => {
  init()

  try {
    provider = await web3Modal.connect()
  } catch (e) {
    console.error('Could not get a wallet connection', e)
    return
  }

  // Subscribe to accounts change
  provider.on('accountsChanged', (accounts) => {
    fetchAccountData(callback)
  })

  // Subscribe to chainId change
  provider.on('chainChanged', (chainId) => {
    fetchAccountData(callback)
  })

  // Subscribe to networkId change
  provider.on('networkChanged', (networkId) => {
    fetchAccountData(callback)
  })

  await refreshAccountData(callback)
}
