import { AccountId } from 'caip'
import { randomString } from '@stablelib/random'
import { Cacao, SiwTezosMessage, AuthMethod, AuthMethodOpts } from '@didtools/cacao'

export const TEZOS_MAINNET_CHAIN_REF = 'NetXdQprcVkpaWU' // Solana mainnet beta
export const TEZOS_DEVNET_CHAIN_REF = 'NetXm8tYqnMWky1' // Solana mainnet beta
export const VERSION = '1'
export const CHAIN_NAMESPACE = 'tezos'

export const chainIdMap = {
  mainnet: TEZOS_MAINNET_CHAIN_REF,
  devnet: TEZOS_DEVNET_CHAIN_REF,
}

type TezosNetwork = 'mainnet' | 'devnet'

export namespace TezosWebAuth {
  // eslint-disable-next-line @typescript-eslint/require-await
  export async function getAuthMethod(
    tzProvider: any,
    account: AccountId,
    publicKey: string
  ): Promise<AuthMethod> {
    if (typeof window === 'undefined')
      throw new Error('Web Auth method requires browser environment')
    const domain = (window as Window).location.hostname

    return async (opts: AuthMethodOpts): Promise<Cacao> => {
      opts.domain = domain
      return createCACAO(opts, tzProvider, account, publicKey)
    }
  }
}

export type SupportedProvider = {
  requestSignPayload: (opts: {
    signingType: string
    payload: string
  }) => Promise<{ signature: string }>
}

export function assertSupportedProvider(tzProvider: any): asserts tzProvider is SupportedProvider {
  const p = tzProvider as SupportedProvider
  if (p.requestSignPayload == null) {
    throw new Error('Unsupported provider; provider must implement requestSignPayload')
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
  account: AccountId,
  publicKey: string
): Promise<Cacao> {
  const now = new Date()
  const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  const siwTezosMessage = new SiwTezosMessage({
    domain: opts.domain,
    address: account.address,
    statement: opts.statement ?? 'Give this application access to some of your data on Ceramic',
    uri: opts.uri,
    version: VERSION,
    nonce: opts.nonce ?? randomString(10),
    issuedAt: now.toISOString(),
    expirationTime: opts.expirationTime ?? oneDayLater.toISOString(),
    chainId: account.chainId.reference,
    resources: opts.resources,
  })

  const signData = siwTezosMessage.signMessage()
  const signature = await sign(tzProvider, signData)
  siwTezosMessage.signature = signature + publicKey
  return Cacao.fromSiwTezosMessage(siwTezosMessage)
}

export function requestChainId(network: TezosNetwork): string {
  return chainIdMap[network]
}

export function getAccountId(network: TezosNetwork, address: string): AccountId {
  const tezosChainId = requestChainId(network)
  const chainId = `${CHAIN_NAMESPACE}:${tezosChainId}`
  return new AccountId({ address, chainId })
}

export function getAccountIdByNetwork(network: TezosNetwork, address: string): AccountId {
  const chainId = `${CHAIN_NAMESPACE}:${requestChainId(network)}`
  return new AccountId({ address, chainId })
}
