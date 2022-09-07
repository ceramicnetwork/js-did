import { SignatureType, SiwxMessage } from './siwx.js'

export class SiweMessage extends SiwxMessage {
  /**
   * This function can be used to retrieve an EIP-4361 formated message for
   * signature, although you can call it directly it's advised to use
   * [signMessage()] instead which will resolve to the correct method based
   * on the [type] attribute of this object, in case of other formats being
   * implemented.
   * @returns {string} EIP-4361 formated message, ready for EIP-191 signing.
   */
  toMessage(): string {
    return super.toMessage('Ethereum')
  }

  /**
   * This method parses all the fields in the object and creates a sign
   * message according with the type defined.
   * @returns {string} Returns a message ready to be signed according with the
   * type defined in the object.
   */
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
