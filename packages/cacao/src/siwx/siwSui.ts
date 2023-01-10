import { SignatureType, SiwxMessage } from './siwx.js'


export class SiwsSuiMessage extends SiwxMessage {
  toMessage(): string {
    return super.toMessage('Sui')
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