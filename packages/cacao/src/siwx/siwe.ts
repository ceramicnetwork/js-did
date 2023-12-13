import { SignatureType, SiwxMessage } from './siwx.js'
import { checksumAddress } from 'viem'

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

  toMessageEip55(): string {
    const tmpAddress = this.address
    this.address = checksumAddress(this.address as `0x${string}`)
    const msg = super.toMessage('Ethereum')
    this.address = tmpAddress
    return msg
  }

  /**
   * This method parses all the fields in the object and creates a sign
   * message according with the type defined.
   * @returns {string} Returns a message ready to be signed according with the
   * type defined in the object.
   */
  signMessage(eip55?: boolean): string {
    // TODO - switch to eip55 by default when the verification change has been roled out
    let message: string
    switch (this.type) {
      case SignatureType.PERSONAL_SIGNATURE: {
        message = eip55 ? this.toMessageEip55() : this.toMessage()
        break
      }

      default: {
        message = eip55 ? this.toMessageEip55() : this.toMessage()
        break
      }
    }
    return message
  }
}
