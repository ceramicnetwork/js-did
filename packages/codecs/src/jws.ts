import { type TypeOf, array, optional, sparse, strict, string } from 'codeco'

import { cidAsString } from './ipld.js'

export const JWSSignature = strict({
  protected: string,
  signature: string,
})
export type JWSSignature = TypeOf<typeof JWSSignature>

export const DagJWS = sparse({
  payload: string,
  signatures: array(JWSSignature),
  link: optional(cidAsString),
})
export type DagJWS = TypeOf<typeof DagJWS>

export const GeneralJWS = strict({
  payload: string,
  signatures: array(JWSSignature),
})
export type GeneralJWS = TypeOf<typeof GeneralJWS>
