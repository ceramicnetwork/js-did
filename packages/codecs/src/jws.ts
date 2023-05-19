import { array, optional, sparse, strict, string } from 'codeco'
import type { CID } from 'multiformats'

import { cidAsString } from './ipld.js'

export const JWSSignature = strict({
  protected: string,
  signature: string,
})
export type JWSSignature = {
  protected: string
  signature: string
}

export const DagJWS = sparse({
  payload: string,
  signatures: array(JWSSignature),
  link: optional(cidAsString),
})
export type DagJWS = {
  payload: string
  signatures: Array<JWSSignature>
  link?: CID
}

export const GeneralJWS = strict({
  payload: string,
  signatures: array(JWSSignature),
})
export type GeneralJWS = {
  payload: string
  signatures: Array<JWSSignature>
}
