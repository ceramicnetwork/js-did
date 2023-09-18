import { array, keyof, optional, sparse, strict, string } from 'codeco'

export const CacaoHeader = strict({ t: keyof({ eip4361: null, caip122: null }) }, 'CacaoHeader')
export type CacaoHeader = { t: 'eip4361' | 'caip122' }

export const CacaoPayload = sparse(
  {
    domain: string,
    iss: string,
    aud: string,
    version: string,
    nonce: string,
    iat: string,
    nbf: optional(string),
    exp: optional(string),
    statement: optional(string),
    requestId: optional(string),
    resources: optional(array(string)),
  },
  'CacaoPayload'
)
export type CacaoPayload = {
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

export const CacaoSignature = strict(
  {
    t: keyof({
      eip191: null,
      eip1271: null,
      'solana:ed25519': null,
      'tezos:ed25519': null,
      'stacks:secp256k1': null,
    }),
    s: string,
  },
  'CacaoSignature'
)
export type CacaoSignature = {
  t: 'eip191' | 'eip1271' | 'solana:ed25519' | 'tezos:ed25519' | 'stacks:secp256k1' | 'webauthn:p256'
  s: string,
  aad?: Uint8Array
}

export const Cacao = sparse(
  { h: CacaoHeader, p: CacaoPayload, s: optional(CacaoSignature) },
  'Cacao'
)
export type Cacao = {
  h: CacaoHeader
  p: CacaoPayload
  s?: CacaoSignature
}

export const SignedCacao = strict(
  { h: CacaoHeader, p: CacaoPayload, s: CacaoSignature },
  'SignedCacao'
)
export type SignedCacao = {
  h: CacaoHeader
  p: CacaoPayload
  s: CacaoSignature
}
