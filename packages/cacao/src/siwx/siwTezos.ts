import { SignatureType, SiwxMessage } from './siwx.js'
import * as uint8arrays from 'uint8arrays'

export class SiwTezosMessage extends SiwxMessage {
  toMessage(): string {
    return super.toMessage('Tezos')
  }

  signMessage(): string {
    let message: string
    switch (this.type) {
      case SignatureType.PERSONAL_SIGNATURE: {
        message = encodePayload(this.toMessage())
        break
      }

      default: {
        message = encodePayload(this.toMessage())
        break
      }
    }

    return message
  }
}

function encodePayload(message: string): string {
  const michelinePrefix = '05'
  const stringPrefix = '01'
  const len = ('0000000' + message.length.toString(16)).slice(-8)

  const text = uint8arrays.toString(uint8arrays.fromString(message, 'utf-8'), 'hex')
  return michelinePrefix + stringPrefix + len + text
}
