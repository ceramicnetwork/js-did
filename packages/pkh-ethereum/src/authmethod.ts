import { Cacao, SiweMessage, AuthMethod, AuthMethodOpts } from '@didtools/cacao'
import { randomString } from '@stablelib/random'
import { AccountId } from 'caip'
import { safeSend } from './utils.js'

/**
 * SIWX Version
 */
export const VERSION = '1'
/**
 * CAIP2 for ethereum, used in CAIP10 (acountId)
 */
export const CHAIN_NAMESPACE = 'eip155'

function toAccountId (didOrAccount: string | AccountId): AccountId {
  if (typeof didOrAccount === 'string') {
    if (!didOrAccount.startsWith(`did:pkh:${CHAIN_NAMESPACE}`)) {
      throw new Error(`Invalid DID string: ${didOrAccount}`)
    }
    return new AccountId(didOrAccount.slice(8))
  }
  return didOrAccount as AccountId
}

export namespace EthereumWebAuth {
  /**
   * Get a configured authMethod for an Ethereum account in a web based environment
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  export async function getAuthMethod(ethProvider: any, account: AccountId | string): Promise<AuthMethod> {
    if (typeof window === 'undefined')
      throw new Error('Web Auth method requires browser environment')
    const domain = (window as Window).location.hostname

    return async (opts: AuthMethodOpts): Promise<Cacao> => {
      opts.domain = domain
      return createCACAO(opts, ethProvider, toAccountId(account))
    }
  }
}

export namespace EthereumNodeAuth {
  /**
   * Get a configured authMethod for an Ethereum account in a Node based environment
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  export async function getAuthMethod(
    ethProvider: any,
    account: AccountId,
    appName: string
  ): Promise<AuthMethod> {
    const domain = appName

    return async (opts: AuthMethodOpts): Promise<Cacao> => {
      opts.domain = domain
      return createCACAO(opts, ethProvider, toAccountId(account))
    }
  }
}

async function createCACAO(
  opts: AuthMethodOpts,
  ethProvider: any,
  account: AccountId
): Promise<Cacao> {
  const now = new Date()
  const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const siweMessage = new SiweMessage({
    domain: opts.domain,
    address: account.address,
    statement: opts.statement ?? 'Give this application access to some of your data on Ceramic',
    uri: opts.uri,
    version: VERSION,
    nonce: opts.nonce ?? randomString(10),
    issuedAt: now.toISOString(),
    expirationTime: opts.expirationTime ?? oneWeekLater.toISOString(),
    chainId: account.chainId.reference,
    resources: opts.resources,
  })
  const signature = await safeSend(ethProvider, 'personal_sign', [
    siweMessage.signMessage(),
    account.address,
  ])
  siweMessage.signature = signature
  return Cacao.fromSiweMessage(siweMessage)
}

async function requestChainId(provider: any): Promise<number> {
  const chainIdHex = (await safeSend(provider, 'eth_chainId', [])) as string
  return parseInt(chainIdHex, 16)
}

/**
 * Helper function to get an accountId (CAIP10) for an Ethereum account, uses ethProvider to get chainId/network
 */
export async function getAccountId(ethProvider: any, address: string): Promise<AccountId> {
  const ethChainId = await requestChainId(ethProvider)
  const chainId = `${CHAIN_NAMESPACE}:${ethChainId}`
  return new AccountId({ address, chainId })
}

/**
 * Helper function to get a PKH DID for an Ethereum account, uses ethProvider to get chainId/network
 */
export async function getDID(ethProvider: any, address: string): Promise<string> {
  return `did:pkh:${getAccountId(ethProvider, address).toString()}`
}
