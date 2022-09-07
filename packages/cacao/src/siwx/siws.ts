import { SignatureType, SiwxMessage } from './siwx.js'

export class SiwsMessage extends SiwxMessage {
  toMessage(): string {
    return super.toMessage('Solana')
  }

  signMessage(): Uint8Array {
    let message: Uint8Array
    switch (this.type) {
      case SignatureType.PERSONAL_SIGNATURE: {
        message = new TextEncoder().encode(this.toMessage())
        break
      }

      default: {
        message = new TextEncoder().encode(this.toMessage())
        break
      }
    }

    return message
  }
}
