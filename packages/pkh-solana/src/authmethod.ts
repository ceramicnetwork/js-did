import { AccountId } from 'caip'
import { toString } from 'uint8arrays/to-string'
import { randomString } from '@stablelib/random'
import { Cacao, SiwsMessage, AuthMethod, AuthMethodOpts } from '@didtools/cacao'

export const SOLANA_TESTNET_CHAIN_REF = '4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z' // Solana testnet
export const SOLANA_DEVNET_CHAIN_REF = 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1' // Solana devnet
export const SOLANA_MAINNET_CHAIN_REF = '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp' // Solana mainnet beta
export const VERSION = '1'
export const CHAIN_NAMESPACE = 'solana'

export const chainIdMap = {
  mainnet: SOLANA_MAINNET_CHAIN_REF,
  testnet: SOLANA_TESTNET_CHAIN_REF,
  devnet: SOLANA_DEVNET_CHAIN_REF,
}

type SolanaNetwork = 'mainnet' | 'testnet' | 'devnet'

export namespace SolanaWebAuth {
  /**
   * Get a configured authMethod for a Solana account in a web based environment
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  export async function getAuthMethod(solProvider: any, account: AccountId): Promise<AuthMethod> {
    if (typeof window === 'undefined')
      throw new Error('Web Auth method requires browser environment')
    const domain = (window as Window).location.hostname

    return async (opts: AuthMethodOpts): Promise<Cacao> => {
      opts.domain = domain
      return createCACAO(opts, solProvider, account)
    }
  }
}

export namespace SolanaNodeAuth {
  /**
   * Get a configured authMethod for a Solana account in a node based environment
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
      return createCACAO(opts, ethProvider, account)
    }
  }
}

export type SupportedProvider = {
  signMessage: (message: Uint8Array, type: string) => Promise<{ signature: Uint8Array }>
}

export type SupportedConnection = {
  getGenesisHash: () => Promise<string>
}

export function assertSupportedProvider(
  solProvider: any
): asserts solProvider is SupportedProvider {
  const p = solProvider as SupportedProvider
  if (p.signMessage === null || p.signMessage === undefined) {
    throw new Error(`Unsupported provider; provider must implement signMessage`)
  }
}

export function assertSupportedConnection(
  solConnection: any
): asserts solConnection is SupportedConnection {
  const c = solConnection as SupportedConnection
  if (c.getGenesisHash === null || c.getGenesisHash === undefined) {
    throw new Error(`Unsupported provider; provider must implement getGenesisHash`)
  }
}

async function sign(solProvider: any, message: Uint8Array) {
  assertSupportedProvider(solProvider)
  const { signature } = await solProvider.signMessage(message, 'utf8')
  return toString(signature, 'base58btc')
}

async function createCACAO(
  opts: AuthMethodOpts,
  solProvider: any,
  account: AccountId
): Promise<Cacao> {
  const now = new Date()
  const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const siwsMessage = new SiwsMessage({
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

  const signData = siwsMessage.signMessage()
  const signature = await sign(solProvider, signData)
  siwsMessage.signature = signature
  return Cacao.fromSiwsMessage(siwsMessage)
}

export async function requestChainId(solConnection: any): Promise<string> {
  assertSupportedConnection(solConnection)
  const genesisHash = await solConnection.getGenesisHash()
  return genesisHash.slice(0, 32)
}

/**
 * Helper function to get an accountId (CAIP10) for an Solana account by Solana Connection interface, Connection must implement 'getGenesisHash()'
 */
export async function getAccountId(solConnection: any, address: string): Promise<AccountId> {
  const solChainId = await requestChainId(solConnection)
  const chainId = `${CHAIN_NAMESPACE}:${solChainId}`
  return new AccountId({ address, chainId })
}

/**
 * Helper function to get an accountId (CAIP10) for an Solana account by network string 'mainet' | 'testnet' | 'devenet'
 */
export function getAccountIdByNetwork(network: SolanaNetwork, address: string): AccountId {
  const chainId = `${CHAIN_NAMESPACE}:${chainIdMap[network]}`
  return new AccountId({ address, chainId })
}
