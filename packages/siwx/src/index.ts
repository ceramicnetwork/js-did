export {
  SiwxMessage,
  toString,
  fromString,
  fromStringSafe,
  type SiwxMessageFields,
} from './siwx-message.js'

export type {
  DomainString,
  NetworkString,
  AddressString,
  NonEmptyString,
  URIString,
  VersionString,
  ChainIdString,
  NonceString,
  DateTimeString,
} from './fields.js'

export * from './signed-siwx-message.js'
