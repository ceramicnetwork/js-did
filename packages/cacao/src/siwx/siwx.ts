/* eslint-disable  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
// @ts-nocheck
import type { Cacao } from '../cacao.js'
import { ParsedMessage as ABNFParsedMessage } from '../abnf.js'
import { AccountId, ChainId } from 'caip'

/**
 * Possible message error types.
 */
export enum ErrorTypes {
  /**Thrown when the `validate()` function can verify the message. */
  INVALID_SIGNATURE = 'Invalid signature.',
  /**Thrown when the `expirationTime` is present and in the past. */
  EXPIRED_MESSAGE = 'Expired message.',
  /**Thrown when some required field is missing. */
  MALFORMED_SESSION = 'Malformed session.',
}

/**
 * Possible signature types that this library supports.
 */
export enum SignatureType {
  /**EIP-191 signature scheme */
  PERSONAL_SIGNATURE = 'Personal signature',
}

export class SiwxMessage {
  /**RFC 4501 dns authority that is requesting the signing. */
  domain: string
  /**Ethereum address performing the signing conformant to capitalization
   * encoded checksum specified in EIP-55 where applicable. */
  address: string
  /**Human-readable ASCII assertion that the user will sign, and it must not
   * contain `\n`. */
  statement?: string = undefined
  /**RFC 3986 URI referring to the resource that is the subject of the signing
   *  (as in the __subject__ of a claim). */
  uri: string
  /**Current version of the message. */
  version: string
  /**Randomized token used to prevent replay attacks, at least 8 alphanumeric
   * characters. */
  nonce?: string = undefined
  /**ISO 8601 datetime string of the current time. */
  issuedAt?: string = undefined
  /**ISO 8601 datetime string that, if present, indicates when the signed
   * authentication message is no longer valid. */
  expirationTime?: string = undefined
  /**ISO 8601 datetime string that, if present, indicates when the signed
   * authentication message will become valid. */
  notBefore?: string = undefined
  /**System-specific identifier that may be used to uniquely refer to the
   * sign-in request. */
  requestId?: string = undefined
  /**EIP-155 Chain ID to which the session is bound, and the network where
   * Contract Accounts must be resolved. */
  chainId: string
  /**List of information or references to information the user wishes to have
   * resolved as part of authentication by the relying party. They are
   * expressed as RFC 3986 URIs separated by `\n- `. */
  resources?: Array<string> = undefined
  /**Signature of the message signed by the wallet. */
  signature?: string = undefined
  /**Type of sign message to be generated. */
  type?: SignatureType

  constructor(param: string | Partial<SiwxMessage>) {
    if (typeof param === 'string') {
      const parsedMessage = new ABNFParsedMessage(param)
      this.domain = parsedMessage.domain
      this.address = parsedMessage.address
      this.statement = parsedMessage.statement
      this.uri = parsedMessage.uri
      this.version = parsedMessage.version
      this.nonce = parsedMessage.nonce
      this.issuedAt = parsedMessage.issuedAt
      this.expirationTime = parsedMessage.expirationTime
      this.notBefore = parsedMessage.notBefore
      this.requestId = parsedMessage.requestId
      this.chainId = parsedMessage.chainId
      this.resources = parsedMessage.resources
    } else {
      Object.assign(this, param)
    }
  }

  static fromCacao<T extends SiwxMessage>(this: new (...args: Array<any>) => T, cacao: Cacao): T {
    const account = AccountId.parse(cacao.p.iss.replace('did:pkh:', ''))
    const siwx = new this({
      domain: cacao.p.domain,
      address: account.address,
      uri: cacao.p.aud,
      version: cacao.p.version,
      chainId: new ChainId(account.chainId).reference,
    })

    if (cacao.p.statement) siwx.statement = cacao.p.statement
    if (cacao.p.nonce) siwx.nonce = cacao.p.nonce
    if (cacao.p.iat) siwx.issuedAt = cacao.p.iat
    if (cacao.p.exp) siwx.expirationTime = cacao.p.exp
    if (cacao.p.nbf) siwx.notBefore = cacao.p.nbf
    if (cacao.p.requestId) siwx.requestId = cacao.p.requestId
    if (cacao.p.resources) siwx.resources = cacao.p.resources

    if (cacao.s) {
      if (cacao.s.s) siwx.signature = cacao.s.s
      if (cacao.s.t === 'eip191') siwx.type = SignatureType.PERSONAL_SIGNATURE
    }

    return siwx
  }

  toMessage(chain: string): string {
    return asString(this, chain)
  }
}

export function asLegacyChainIdString(message: SiwxMessage, chainName: string): string {
  const header = `${message.domain} wants you to sign in with your ${chainName} account:`
  const uriField = `URI: ${message.uri}`
  let prefix = [header, message.address].join('\n')
  const versionField = `Version: ${message.version}`

  if (!message.nonce) {
    message.nonce = (Math.random() + 1).toString(36).substring(4)
  }

  const nonceField = `Nonce: ${message.nonce}`

  const suffixArray = [uriField, versionField, nonceField]

  if (message.issuedAt) {
    Date.parse(message.issuedAt)
  }
  message.issuedAt = message.issuedAt ? message.issuedAt : new Date().toISOString()
  suffixArray.push(`Issued At: ${message.issuedAt}`)

  if (message.expirationTime) {
    const expiryField = `Expiration Time: ${message.expirationTime}`

    suffixArray.push(expiryField)
  }

  if (message.notBefore) {
    suffixArray.push(`Not Before: ${message.notBefore}`)
  }

  if (message.requestId) {
    suffixArray.push(`Request ID: ${message.requestId}`)
  }

  if (message.chainId) {
    suffixArray.push(`Chain ID: ${message.chainId}`)
  }

  if (message.resources) {
    suffixArray.push([`Resources:`, ...message.resources.map((x) => `- ${x}`)].join('\n'))
  }

  const suffix = suffixArray.join('\n')

  if (message.statement) {
    prefix = [prefix, message.statement].join('\n\n')
  }

  return [prefix, suffix].join('\n\n')
}

export function asString(message: SiwxMessage, chainName: string): string {
  const header = `${message.domain} wants you to sign in with your ${chainName} account:`
  const uriField = `URI: ${message.uri}`
  let prefix = [header, message.address].join('\n')
  const versionField = `Version: ${message.version}`

  if (!message.nonce) {
    message.nonce = (Math.random() + 1).toString(36).substring(4)
  }

  const nonceField = `Nonce: ${message.nonce}`
  const chainIdField = `Chain ID: ${message.chainId}`

  const suffixArray = [uriField, versionField, chainIdField, nonceField]

  if (message.issuedAt) {
    Date.parse(message.issuedAt)
  }
  message.issuedAt = message.issuedAt ? message.issuedAt : new Date().toISOString()
  suffixArray.push(`Issued At: ${message.issuedAt}`)

  if (message.expirationTime) {
    const expiryField = `Expiration Time: ${message.expirationTime}`

    suffixArray.push(expiryField)
  }

  if (message.notBefore) {
    suffixArray.push(`Not Before: ${message.notBefore}`)
  }

  if (message.requestId) {
    suffixArray.push(`Request ID: ${message.requestId}`)
  }

  if (message.resources && message.resources.length >= 1) {
    suffixArray.push([`Resources:`, ...message.resources.map((x) => `- ${x}`)].join('\n'))
  }

  const suffix = suffixArray.join('\n')

  if (message.statement) {
    prefix = [prefix, message.statement].join('\n\n')
  }

  return [prefix, suffix].join('\n\n')
}
