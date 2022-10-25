import { SignatureType, SiwxMessage } from './siwx.js'
import { Buffer } from 'buffer'

export class SiwTezosMessage extends SiwxMessage {
  toMessage(): string {
    return super.toMessage('Tezos')
  }

  signMessage(): string {
    let message: string
    switch (this.type) {
      case SignatureType.PERSONAL_SIGNATURE: {
        message = encodeTezosPayload(this.toMessage())
        break
      }

      default: {
        message = encodeTezosPayload(this.toMessage())
        break
      }
    }

    return message
  }
}

function encodeTezosPayload(message: string): string {
  const bytes = Buffer.from(message, 'utf8').toString('hex')
  const lenBytes = `0000${bytes.length}`.slice(-4)
  return '0501' + lenBytes + bytes
}
