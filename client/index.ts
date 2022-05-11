import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

export '../common/index'

/* eslint-env browser */

/* global location */

interface IProviderInfo {
  id: string
  type: string
  check: string
  name: string
  logo: string
  description?: string
  package?: {
    required?: string[]
  }
}

type ThemeColors = {
  background: string
  main: string
  secondary: string
  border: string
  hover: string
}

type ProviderInfo = {
  package: IProviderInfo
  options?: any
}

interface ProviderOptions {
  walletconnect?: ProviderInfo
  formatic?: ProviderInfo
  // TODO https://github.com/Web3Modal/web3modal#provider-options
  torus?: ProviderInfo
  portis?: ProviderInfo
  authereum?: ProviderInfo
  frame?: ProviderInfo
  bitski?: ProviderInfo
  venly?: ProviderInfo
  burnerconnect?: ProviderInfo
  mewconnect?: ProviderInfo
  binancechainwallet?: {
    package: boolean
  }
  walletlink?: ProviderInfo
}

export type LoginOptions = {
  loginMessage: string,
  onlyReturnAddress?: boolean // This will stop the actual login method and only returns the address
}

export const isHttps = () => location.protocol === 'https:'

// Web3modal instance
let web3Modal

// Chosen wallet provider given by the dialog window
let provider

// Address of the selected account
let selectedAccount

function init() {
  // We have to go to window.exports to access what we import in ./importScripts.ts
  // @ts-ignore
  const Web3Modal = window.exports.Web3Modal.default

  // Check that the web page is run in a secure context,
  // as otherwise MetaMask won't be available
  if (!isHttps()) {
    return
  }

  // Tell Web3modal what providers we have available.
  // Built-in web browser provider (only one can exist as a time)
  // like MetaMask, Brave or Opera is added automatically by Web3modal
  const providerOptions: ProviderOptions = {}
  // TODO more options
  if (
    Meteor.settings.public?.packages?.['freedombase:web3-login']
      ?.walletconnect &&
    window.exports.WalletConnectProvider
  ) {
    providerOptions.walletconnect = {
      package: window.exports.WalletConnectProvider?.default,
      options:
      Meteor.settings.public.packages['freedombase:web3-login'].walletconnect
    }
  }
  if (
    Meteor.settings.public?.packages?.['freedombase:web3-login']?.formatic &&
    window.exports.Fortmatic
  ) {
    providerOptions.formatic = {
      package: window.exports.Fortmatic,
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

export const verifyUserLogin = async (
  message: string,
  usersEthAddress: string,
  callback?: (error?: Meteor.Error, result?: boolean) => void
) => {
  const verificationType =
    Meteor.settings?.public?.packages?.['freedombase:web3-login']
      ?.verificationType || 'personal_sign'

  try {
    const msg = `0x${Buffer.from(message, 'utf8').toString('hex')}`
    const sign = await ethereum.request({
      method: verificationType,
      params: [msg, usersEthAddress, Meteor.userId()]
    })
    Meteor.call(
      'freedombase:verifyWeb3Login',
      sign,
      message,
      usersEthAddress,
      callback
    )
  } catch (e) {
    console.error(e)
  }
}

async function fetchAccountData(
  options: LoginOptions,
  callback: (error?: Meteor.Error, response?: string) => void
) {
  // Get a Web3 instance for the wallet
  const web3 = new window.exports.Web3(provider)

  // Get list of accounts of the connected wallet
  const accounts = await web3.eth.getAccounts()

  // MetaMask does not give you all accounts, only the selected account
  selectedAccount = accounts[0]
  await verifyUserLogin(options.loginMessage, selectedAccount, (err, result) => {
    if (err) {
      throw new Meteor.Error('500', err.reason)
    }
    if (!result) {
      return
    }

    if (options.onlyReturnAddress) {
      callback(null, selectedAccount)
      return selectedAccount
    }

    Accounts.callLoginMethod({
      methodArguments: [
        {
          web3Address: selectedAccount
        }
      ],
      userCallback: (error: Meteor.Error) => {
        if (error) {
          if (callback) {
            callback(error, selectedAccount)
          } else {
            throw error
          }
        } else {
          callback?.()
        }
      }
    })
  })

  return { 'services.web3.address': selectedAccount }
}

/**
 * Fetch account data for UI when
 * - User switches accounts in wallet
 * - User switches networks in wallet
 * - User connects wallet initially
 */
async function refreshAccountData(options: LoginOptions, callback) {
  await fetchAccountData(options, callback)
}

export const loginWithWeb3 = async (
  options: LoginOptions,
  callback: (error?: Meteor.Error, walletAddress?: string) => void
) => {
  init()

  try {
    provider = await web3Modal.connect()
  } catch (e) {
    console.error('Could not get a wallet connection', e)
    return
  }

  // Subscribe to accounts change
  provider.on('accountsChanged', (accounts) => {
    fetchAccountData(options, callback)
  })

  // Subscribe to chainId change
  provider.on('chainChanged', (chainId) => {
    fetchAccountData(options, callback)
  })

  // Subscribe to networkId change
  // This one is deprecated, remove in next major version
  provider.on('networkChanged', (networkId) => {
    fetchAccountData(options, callback)
  })

  await refreshAccountData(options, callback)
}

export const verifyUserAction = async (
  message: string,
  recordVerification = false,
  callback?: (error?: Meteor.Error, result?: boolean) => void
) => {
  const verificationType =
    Meteor.settings?.public?.packages?.['freedombase:web3-login']
      ?.verificationType || 'personal_sign'

  const user = Meteor.user()
  const usersEthAddress = user.services.web3.address

  try {
    const msg = `0x${Buffer.from(message, 'utf8').toString('hex')}`
    const sign = await ethereum.request({
      method: verificationType,
      params: [msg, usersEthAddress, Meteor.userId()]
    })
    Meteor.call(
      'freedombase:verifyWeb3User',
      sign,
      message,
      recordVerification,
      callback
    )
  } catch (e) {
    console.error(e)
  }
}

// @ts-ignore
Meteor.loginWithWeb3 = loginWithWeb3
