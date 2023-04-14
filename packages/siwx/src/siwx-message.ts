import {
  toDateTimeString,
  toDomainString,
  toURIString,
  toVersionString,
  toChainIdString,
  toNonceString,
  toNonEmptyString,
} from './fields.js'
import type {
  DateTimeString,
  DomainString,
  URIString,
  NetworkString,
  AddressString,
  VersionString,
  ChainIdString,
  NonceString,
  NonEmptyString,
} from './fields.js'
import { siwxMessage } from './parsing/siwx-message.js'
import { StringTape, parseAll } from 'codeco/linear'
import { isLeft, right, getOrThrow, type Maybe } from 'codeco'

/**
 * Parameters for SiwxMessage constructor.
 */
export interface SiwxMessageFields {
  readonly domain: string
  readonly network: string
  readonly address: string
  readonly statement?: string
  readonly uri: string
  readonly version?: string | number
  readonly chainId: string | number
  readonly nonce: string | number
  readonly issuedAt: string
  readonly expirationTime?: string
  readonly notBefore?: string
  readonly requestId?: string
  readonly resources?: Array<string>
}

function resourcesList(resources: Array<string>): string {
  return resources.map((r) => `- ${r}`).join(`\n`)
}

export class SiwxMessage implements SiwxMessageFields {
  readonly domain: DomainString
  readonly network: NetworkString
  readonly address: AddressString
  readonly statement?: NonEmptyString
  readonly uri: URIString
  readonly version: VersionString
  readonly chainId: ChainIdString
  readonly nonce: NonceString
  readonly issuedAt: DateTimeString
  readonly expirationTime?: DateTimeString
  readonly notBefore?: DateTimeString
  readonly requestId?: NonEmptyString
  readonly resources?: Array<URIString>

  /**
   * Parse SIWx message string.
   * @throws If invalid string passed.
   */
  static fromString = fromString

  /**
   * Parse SIWx message string. Return `Maybe`, thus do not throw.
   */
  static fromStringSafe = fromStringSafe

  constructor(fields: SiwxMessageFields) {
    this.domain = toDomainString(fields.domain)
    this.network = toNonEmptyString<NetworkString>(fields.network, 'network')
    this.address = toNonEmptyString<AddressString>(fields.address, 'address')
    this.statement = mapUndefined(fields.statement, (s) => toNonEmptyString(s, 'statement'))
    this.uri = toURIString(fields.uri)
    this.version = toVersionString(fields.version || '1')
    this.chainId = toChainIdString(fields.chainId)
    this.nonce = toNonceString(fields.nonce)
    this.issuedAt = toDateTimeString(fields.issuedAt)
    this.expirationTime = mapUndefined(fields.expirationTime, toDateTimeString)
    this.notBefore = mapUndefined(fields.notBefore, toDateTimeString)
    this.requestId = mapUndefined(fields.requestId, (s) => toNonEmptyString(s, 'requestId'))
    this.resources = mapUndefined(fields.resources, (resources) => resources.map(toURIString))
  }

  toString(): string {
    return toString(this)
  }
}

export function fromStringSafe(input: string): Maybe<SiwxMessage> {
  const parser = parseAll(siwxMessage)
  const fields = parser(new StringTape(input))
  if (isLeft(fields)) return fields
  return right(new SiwxMessage(fields.right))
}

export function fromString(input: string): SiwxMessage {
  return getOrThrow(fromStringSafe(input))
}

export function toString(message: SiwxMessage): string {
  const want = `${message.domain} wants you to sign in with your ${message.network} account:`
  const address = message.address
  const statement = message.statement
  const uri = `URI: ${message.uri}`
  const version = `Version: ${message.version}`
  const chainId = `Chain ID: ${message.chainId}`
  const nonce = `Nonce: ${message.nonce}`
  const issuedAt = `Issued At: ${message.issuedAt}`
  const expirationTime = message.expirationTime
    ? `Expiration Time: ${message.expirationTime}`
    : undefined
  const notBefore = message.notBefore ? `Not Before: ${message.notBefore}` : undefined
  const requestId = message.requestId ? `Request ID: ${message.requestId}` : undefined
  const resources = message.resources
    ? `Resources:\n${resourcesList(message.resources)}`
    : undefined
  let header = `${want}\n${address}\n\n`
  if (statement) header += `${statement}\n`
  return [
    header,
    uri,
    version,
    chainId,
    nonce,
    issuedAt,
    expirationTime,
    notBefore,
    requestId,
    resources,
  ]
    .filter(Boolean)
    .join('\n')
}

/**
 * If `field` is defined, return `fn(field)`.
 */
function mapUndefined<T, R>(field: T | undefined, fn: (value: T) => R): R | undefined {
  if (field !== undefined) {
    return fn(field)
  } else {
    return undefined
  }
}
