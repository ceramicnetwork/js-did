import { AccountId } from 'caip'
import { randomString } from '@stablelib/random'
import { Cacao, SiwTezosMessage, AuthMethod, AuthMethodOpts } from '@didtools/cacao'

export const TEZOS_MAINNET_CHAIN_REF = 'NetXdQprcVkpaWU' // Tezos mainnet
export const TEZOS_DEVNET_CHAIN_REF = 'NetXm8tYqnMWky1' // Tezos devnet
export const VERSION = '1'
export const CHAIN_NAMESPACE = 'tezos'

export const chainIdMap = {
  mainnet: TEZOS_MAINNET_CHAIN_REF,
  devnet: TEZOS_DEVNET_CHAIN_REF,
}

type TezosNetwork = 'mainnet' | 'devnet'

export namespace TezosWebAuth {
  export async function getAuthMethod(tzProvider: any, account: AccountId): Promise<AuthMethod> {
    if (typeof window === 'undefined')
      throw new Error('Web Auth method requires browser environment')
    const domain = (window as Window).location.hostname

    return async (opts: AuthMethodOpts): Promise<Cacao> => {
      opts.domain = domain
      return createCACAO(opts, tzProvider, account)
    }
  }
}

export type SupportedProvider = {
  requestSignPayload: (opts: {
    signingType: string
    payload: string
  }) => Promise<{ signature: string }>
  getActiveAccount: () => Promise<{ network: { type: TezosNetwork }; publicKey: string }>
}

export function assertSupportedProvider(tzProvider: any): asserts tzProvider is SupportedProvider {
  const p = tzProvider as SupportedProvider
  if (p.requestSignPayload == null) {
    throw new Error('Unsupported provider; provider must implement requestSignPayload')
  }
}

export function assertSupportedConnection(
  tzProvider: any
): asserts tzProvider is SupportedProvider {
  const c = tzProvider as SupportedProvider
  if (c.getActiveAccount === null || c.getActiveAccount === undefined) {
    throw new Error(`Unsupported provider; provider must implement getActiveAccount`)
  }
}

async function sign(tzProvider: any, message: string) {
  assertSupportedProvider(tzProvider)
  const { signature } = await tzProvider.requestSignPayload({
    signingType: 'micheline',
    payload: message,
  })
  return signature
}

async function createCACAO(
  opts: AuthMethodOpts,
  tzProvider: any,
  account: AccountId
): Promise<Cacao> {
  const now = new Date()
  const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const siwTezosMessage = new SiwTezosMessage({
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

  const signData = siwTezosMessage.signMessage()
  const signature = await sign(tzProvider, signData)
  const publicKey = await getPublicKey(tzProvider)
  siwTezosMessage.signature = signature + publicKey
  return Cacao.fromSiwTezosMessage(siwTezosMessage)
}

export async function requestChainId(tzProvider: any): Promise<string> {
  assertSupportedConnection(tzProvider)
  const activeAccount = await tzProvider.getActiveAccount()
  const network = activeAccount.network.type
  return chainIdMap[network]
}

export async function getAccountId(tzProvider: any, address: string): Promise<AccountId> {
  const tezosChainId = await requestChainId(tzProvider)
  const chainId = `${CHAIN_NAMESPACE}:${tezosChainId}`
  return new AccountId({ address, chainId })
}

export function getAccountIdByNetwork(network: TezosNetwork, address: string): AccountId {
  const chainId = `${CHAIN_NAMESPACE}:${chainIdMap[network]}`
  return new AccountId({ address, chainId })
}

export async function getPublicKey(tzProvider: any): Promise<string> {
  assertSupportedConnection(tzProvider)
  const activeAccount = await tzProvider.getActiveAccount()
  return activeAccount.publicKey
}
