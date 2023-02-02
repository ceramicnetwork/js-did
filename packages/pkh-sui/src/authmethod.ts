import { AccountId } from 'caip'
import { randomString } from '@stablelib/random'
import { toString } from 'uint8arrays/to-string'
import { Cacao, SiwSuiMessage, AuthMethod, AuthMethodOpts } from '@didtools/cacao'

export const SUI_MAINNET_CHAIN_REF = 'mainnet' // TBD when CAIP-2 is finalized
export const SUI_DEVNET_CHAIN_REF = 'devnet';
export const SUI_TESTNET_CHAIN_REF = 'testnet';
export const VERSION = '1'
export const CHAIN_NAMESPACE = 'sui'


export const chainIdMap = {
  mainnet: SUI_MAINNET_CHAIN_REF,
  testnet: SUI_TESTNET_CHAIN_REF,
  devnet: SUI_DEVNET_CHAIN_REF,
}

type SuiNetwork = 'mainnet' | 'testnet' | 'devnet'

export namespace SuiWebAuth {
  // eslint-disable-next-line @typescript-eslint/require-await
  export async function getAuthMethod(suiProvider: any, account: AccountId): Promise<AuthMethod> {
    if (typeof window === 'undefined')
      throw new Error('Web Auth method requires browser environment')
    const domain = (window as Window).location.hostname

    return async (opts: AuthMethodOpts): Promise<Cacao> => {
      opts.domain = domain
      return createCACAO(opts, suiProvider, account)
    }
  }
}

export type SupportedProvider = {
  signMessage: (input: {message: Uint8Array}) => Promise<ExpSignMessageOutput>;
}

export type ExpSignMessageOutput = {
  signature: Uint8Array;
  signedMessage: Uint8Array;
}

export function assertSupportedProvider(suiProvider: any): asserts suiProvider is SupportedProvider {
  const p = suiProvider as SupportedProvider
  if (p.signMessage == null) {
    throw new Error('Unsupported provider; provider must implement requestSignPayload')
  }
}

async function sign(suiProvider: any, message: Uint8Array) {
  assertSupportedProvider(suiProvider)
  const { signature } = await suiProvider.signMessage({message: message})
  return toString(signature, 'base64')
}

async function createCACAO(
  opts: AuthMethodOpts,
  suiProvider: any,
  account: AccountId
): Promise<Cacao> {
  const now = new Date()
  const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const siwSuiMessage = new SiwSuiMessage({
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

  const signData = siwSuiMessage.signMessage()
  const signature = await sign(suiProvider, signData)
  siwSuiMessage.signature = signature
  return Cacao.fromSiwSuiMessage(siwSuiMessage)
}

export async function getAccountId(suiProvider: any, address: string): Promise<AccountId> {
  const suiChainId = await requestChainId(suiProvider)
  const chainId = `${CHAIN_NAMESPACE}:${suiChainId}`
  return new AccountId({ address, chainId })
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function requestChainId(_suiProvider: any): Promise<string> {
  // TODO: add testnets
  return SUI_MAINNET_CHAIN_REF
}

/**
 * Helper function to get an accountId (CAIP10) for an Sui account by network string 'mainet' | 'testnet' | 'devenet'
 */
export function getAccountIdByNetwork(network: SuiNetwork, address: string): AccountId {
  const chainId = `${CHAIN_NAMESPACE}:${chainIdMap[network]}`
  return new AccountId({ address, chainId })
}