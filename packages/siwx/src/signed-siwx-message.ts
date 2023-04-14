import type { SiwxMessage } from "./siwx-message.js";

export type Signature = {
  kind: string,
  bytes: Uint8Array
}

export class SignedSiwxMessage {
  constructor(readonly message: SiwxMessage, readonly signature: Signature) {
  }
}
