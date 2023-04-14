import type { SiwxMessage } from './siwx-message.js'

export type Signature = {
  kind: string
  bytes: Uint8Array
}

export interface ISignedSiwxMessage {
  readonly message: SiwxMessage
  readonly signature: Signature
}

export class SignedSiwxMessage implements ISignedSiwxMessage {
  constructor(readonly message: SiwxMessage, readonly signature: Signature) {}
}
