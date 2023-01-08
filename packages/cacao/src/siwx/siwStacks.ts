import { SignatureType, SiwxMessage } from './siwx.js'

export class SiwStacksMessage extends SiwxMessage {
  toMessage(): string {
    return super.toMessage('Stacks')
  }

  signMessage(): string {
    let message: string
    switch (this.type) {
      case SignatureType.PERSONAL_SIGNATURE: {
        message = this.toMessage()
        break
      }

      default: {
        message = this.toMessage()
        break
      }
    }

    return message
  }
}
