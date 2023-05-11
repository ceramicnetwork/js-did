import { type TypeOf, array, keyof, optional, sparse, strict, string } from 'codeco'

export const CacaoHeader = strict({ t: keyof({ eip4361: null, caip122: null }) }, 'CacaoHeader')
export type CacaoHeader = TypeOf<typeof CacaoHeader>

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
export type CacaoPayload = TypeOf<typeof CacaoPayload>

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
export type CacaoSignature = TypeOf<typeof CacaoSignature>

export const Cacao = sparse(
  { h: CacaoHeader, p: CacaoPayload, s: optional(CacaoSignature) },
  'Cacao'
)
export type Cacao = TypeOf<typeof Cacao>

export const SignedCacao = strict(
  { h: CacaoHeader, p: CacaoPayload, s: CacaoSignature },
  'SignedCacao'
)
export type SignedCacao = TypeOf<typeof SignedCacao>
