// @ts-nocheck
import * as dagCbor from '@ipld/dag-cbor'
import * as multiformats from 'multiformats'
import * as Block from 'multiformats/block'
import { sha256 as hasher } from 'multiformats/hashes/sha2'
import { SiweMessage } from './siwx/siwe.js'
import { SiwsMessage } from './siwx/siws.js'

// 5 minute default clockskew
const CLOCK_SKEW_DEFAULT_SEC = 5 * 60

// CACAOs issued after that day must be of new format
export const LEGACY_CHAIN_ID_REORG_DATE = new Date('2022-09-20').valueOf()

export type CacaoBlock = {
  value: Cacao
  cid: multiformats.CID
  bytes: Uint8Array
}

export type Header = {
  t: 'eip4361' | 'caip122'
}

export type Signature = {
  t: 'eip191' | 'eip1271' | 'solana:ed25519'
  s: string
}
export type Cacao = {
  h: Header
  p: Payload
  s?: Signature
}

export type SignedCacao = {
  h: Header
  p: Payload
  s: Signature
}

export type Verifiers = Record<string, CacaoVerifier>

export type CacaoVerifier = (cacao: Cacao, opts: VerifyOptions) => Promise<void>

export type AuthMethod = (opts: AuthMethodOpts) => Promise<Cacao>

export type Payload = {
  domain: string
  iss: string
  aud: string
  version: string
  nonce: string
  iat: string
  nbf?: string
  exp?: string
  statement?: string
  requestId?: string
  resources?: Array<string>
}

export type VerifyOptions = {
  /**
   * @param verifiers - object of supported verification methods to verify given cacao
   */
  verifiers: Verifiers
  /**
   * @param atTime - the point in time the capability is being verified for
   */
  atTime?: Date
  /**
   * @param expPhaseOutSecs - Number of seconds that a capability stays valid for after it was expired
   */
  revocationPhaseOutSecs?: number
  /**
   * @param clockSkewSecs - Number of seconds of clock tolerance when verifying iat, nbf, and exp
   */
  clockSkewSecs?: number

  /**
   * @param disableExpirationCheck - Do not verify expiration time
   */
  disableExpirationCheck?: boolean
}

export type AuthMethodOpts = {
  /**RFC 4501 dns authority that is requesting the signing. */
  domain?: string
  /**Ethereum address performing the signing conformant to capitalization
   * encoded checksum specified in EIP-55 where applicable. */
  address?: string
  /**Human-readable ASCII assertion that the user will sign, and it must not
   * contain `\n`. */
  statement?: string
  /**RFC 3986 URI referring to the resource that is the subject of the signing
   *  (as in the __subject__ of a claim). */
  uri?: string
  /**Current version of the message. */
  version?: string
  /**Randomized token used to prevent replay attacks, at least 8 alphanumeric
   * characters. */
  nonce?: string
  /**ISO 8601 datetime string of the current time. */
  issuedAt?: string
  /**ISO 8601 datetime string that, if present, indicates when the signed
   * authentication message is no longer valid. */
  expirationTime?: string
  /**ISO 8601 datetime string that, if present, indicates when the signed
   * authentication message will become valid. */
  notBefore?: string
  /**System-specific identifier that may be used to uniquely refer to the
   * sign-in request. */
  requestId?: string
  /**EIP-155 Chain ID to which the session is bound, and the network where
   * Contract Accounts must be resolved. */
  chainId?: string
  /**List of information or references to information the user wishes to have
   * resolved as part of authentication by the relying party. They are
   * expressed as RFC 3986 URIs separated by `\n- `. */
  resources?: Array<string>
}

export namespace Cacao {
  export function fromSiweMessage(siweMessage: SiweMessage): Cacao {
    const cacao: Cacao = {
      h: {
        t: 'eip4361', // TODO: Replace with "caip122" after 2022-09-24
      },
      p: {
        domain: siweMessage.domain,
        iat: siweMessage.issuedAt,
        iss: `did:pkh:eip155:${siweMessage.chainId}:${siweMessage.address}`,
        aud: siweMessage.uri,
        version: siweMessage.version,
        nonce: siweMessage.nonce,
      },
    }

    if (siweMessage.signature) {
      cacao.s = {
        t: 'eip191',
        s: siweMessage.signature,
      }
    }

    if (siweMessage.notBefore) {
      cacao.p.nbf = siweMessage.notBefore
    }

    if (siweMessage.expirationTime) {
      cacao.p.exp = siweMessage.expirationTime
    }

    if (siweMessage.statement) {
      cacao.p.statement = siweMessage.statement
    }

    if (siweMessage.requestId) {
      cacao.p.requestId = siweMessage.requestId
    }

    if (siweMessage.resources) {
      cacao.p.resources = siweMessage.resources
    }

    return cacao
  }

  export function fromSiwsMessage(siwsMessage: SiwsMessage): Cacao {
    const cacao: Cacao = {
      h: {
        t: 'caip122',
      },
      p: {
        domain: siwsMessage.domain,
        iat: siwsMessage.issuedAt,
        iss: `did:pkh:solana:${siwsMessage.chainId}:${siwsMessage.address}`,
        aud: siwsMessage.uri,
        version: siwsMessage.version,
        nonce: siwsMessage.nonce,
      },
    }

    if (siwsMessage.signature) {
      cacao.s = {
        // https://github.com/solana-labs/wallet-adapter/issues/179
        t: 'solana:ed25519',
        s: siwsMessage.signature,
      }
    }

    if (siwsMessage.notBefore) {
      cacao.p.nbf = siwsMessage.notBefore
    }

    if (siwsMessage.expirationTime) {
      cacao.p.exp = siwsMessage.expirationTime
    }

    if (siwsMessage.statement) {
      cacao.p.statement = siwsMessage.statement
    }

    if (siwsMessage.requestId) {
      cacao.p.requestId = siwsMessage.requestId
    }

    if (siwsMessage.resources) {
      cacao.p.resources = siwsMessage.resources
    }

    return cacao
  }

  export async function fromBlockBytes(bytes: Uint8Array): Promise<Cacao> {
    const block = await Block.decode({ bytes: bytes, codec: dagCbor, hasher: hasher })
    return block.value as Cacao
  }

  export async function verify(cacao: Cacao, opts: VerifyOptions = {}): Promise<void> {
    assertSigned(cacao)
    const verify = opts.verifiers[cacao.s.t]
    if (!verify) throw new Error('Unsupported CACAO signature type, register the needed verifier')
    return verify(cacao, opts)
  }
}

export namespace CacaoBlock {
  export function fromCacao(cacao: Cacao): Promise<CacaoBlock> {
    return Block.encode<Cacao, number, number>({
      value: cacao,
      codec: dagCbor,
      hasher: hasher,
    })
  }
}

export function assertSigned(cacao: Cacao): asserts cacao is SignedCacao {
  if (cacao.s === null || cacao.s === undefined) {
    throw new Error(`CACAO does not have a signature`)
  }
}

export function verifyTimeChecks(cacao: Cacao, options: VerifyOptions) {
  const atTime = options.atTime ? options.atTime.getTime() : Date.now()
  const clockSkew = (options.clockSkewSecs ?? CLOCK_SKEW_DEFAULT_SEC) * 1000

  if (
    Date.parse(cacao.p.iat) > atTime + clockSkew ||
    Date.parse(cacao.p.nbf) > atTime + clockSkew
  ) {
    throw new Error(`CACAO is not valid yet`)
  }

  const phaseOutMS = options.revocationPhaseOutSecs ? options.revocationPhaseOutSecs * 1000 : 0

  if (
    !options.disableExpirationCheck &&
    Date.parse(cacao.p.exp) + phaseOutMS + clockSkew < atTime
  ) {
    throw new Error(`CACAO has expired`)
  }
}
