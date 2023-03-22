/**
 * # Multidid
 * Multidid is a representation strategy for DIDs and DID URLs that is very compact and extensible. It allows any DID method to be represented as a
 * string of bytes. Reference [specification](https://github.com/ChainAgnostic/multidid).
 *
 * This library is a multidid utility library to encode and decode multidids to their byte and string representation and convert from did strings to multidid representations.
 *
 * ## Installation
 *
 * ```
 * npm install --save @didtools/multidid
 * ```
 *
 * ## Usage
 *
 * ```js
 * import { Multidid } from '@didtools/multidid'
 *
 * const didString = "did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp#z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp"
 *
 * // Multidid instance from did string
 * const multidid = Multidid.fromDIDString(didString)
 *
 * // Encode to bytes
 * multidid.encode()
 *
 * // Decode from bytes to multidid instance
 * Multidid.decode(bytes)
 *
 * // Encode as base16 string
 * const mdStr = multidid.toString('base16')
 * console.log(mdStr)
 * // f9d1aed013b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29307a364d6b6954427a31796d75657041513448454859534631483871754735474c5656515233646a6458336d446f6f5770
 *
 * // Multidid instance from base encoded string
 * Multidid.fromString(mdStr)
 *
 * // DID string from multidid
 * multidid.toDidString()
 *
 * ```
 *
 * @module @didtools/multidid
 */

import * as u8a from 'uint8arrays'
import { alloc } from 'uint8arrays/alloc'
import { varint } from 'multiformats'
import { base58btc } from 'multiformats/bases/base58'
import { base16 } from 'multiformats/bases/base16'

type SupportedBase = 'base16' | 'base58btc'

const MULTIDID_CODEC = 3357
const ALL_METHOD_CODE = 85
const PKH_METHOD_CODE = 202

const KEY_METHOD_CODES_LENGTH: Record<number, number> = {
  // 0xe7
  231: 33,
  // 0xeb
  235: 96,
  //0xec
  236: 32,
  //0xed
  237: 32,
  //0x1200
  4608: 33,
  //0x1201
  4609: 49,
  //0x1202
  4610: 67,
  //0x1205
  // TODO RSA key length
  // 4613: 270 or 256
}

// TODO
// Could makes sense to add general did codec interface

type InspectObject = {
  methodCode: number
  methodIdBytes: Uint8Array
  urlBytes: Uint8Array
}

export class Multidid {
  private mdBytes: Uint8Array | null

  /**
   * @param {number} code - DID Method Codec
   * @param {Uint8Array} id - DID method id
   * @param {Uint8Array} url - DID Method url portion
   *
   */
  constructor(private code: number, private id: Uint8Array, private url: Uint8Array) {
    this.mdBytes = null
  }

  private encode(): Uint8Array {
    const methodCodeOffset = varint.encodingLength(MULTIDID_CODEC)
    const methodIdOffset = methodCodeOffset + varint.encodingLength(this.code)

    let methodIdLen
    if (this.code === ALL_METHOD_CODE) {
      methodIdLen = 0
    } else if (this.code === PKH_METHOD_CODE) {
      throw new Error('TODO')
    } else {
      methodIdLen = KEY_METHOD_CODES_LENGTH[this.code]
    }

    if (!methodIdLen && methodIdLen !== 0) throw new Error('Not matching did method code found')
    if (methodIdLen !== this.id.byteLength)
      throw new Error('Length of method id does not match expected length')

    const urlLenOffset = methodIdOffset + methodIdLen
    const urlBytesOffset = urlLenOffset + varint.encodingLength(this.url.byteLength)

    const bytes = alloc(urlBytesOffset + this.url.byteLength)
    varint.encodeTo(MULTIDID_CODEC, bytes, 0)
    varint.encodeTo(this.code, bytes, methodCodeOffset)
    bytes.set(this.id, methodIdOffset)
    varint.encodeTo(this.url.byteLength, bytes, urlLenOffset)
    bytes.set(this.url, urlBytesOffset)

    return bytes
  }

  /**
   * Decoded a multidid from its binary representation
   */
  static fromBytes(bytes: Uint8Array): Multidid {
    const [, didCodeLen] = varint.decode(bytes, 0)
    const [methodCode, methodCodeLen] = varint.decode(bytes, didCodeLen)
    const methodIdOffset = didCodeLen + methodCodeLen

    let methodIdLen
    if (methodCode === ALL_METHOD_CODE) {
      methodIdLen = 0
    } else if (methodCode === PKH_METHOD_CODE) {
      throw new Error('TODO')
    } else {
      methodIdLen = KEY_METHOD_CODES_LENGTH[methodCode]
    }
    if (!methodIdLen && methodIdLen !== 0) throw new Error('Not matching did method code found')

    const methodId = alloc(methodIdLen)
    methodId.set(bytes.slice(methodIdOffset, methodIdOffset + methodIdLen))
    const urlLenOffset = methodIdOffset + methodIdLen
    const [urlLen, urlLenLen] = varint.decode(bytes, urlLenOffset)
    const urlBytesOffset = urlLenOffset + urlLenLen
    const url = alloc(urlLen)
    url.set(bytes.slice(urlBytesOffset, urlBytesOffset + urlLen))
    return new Multidid(methodCode, methodId, url)
  }

  /**
   * Encode multidid to bytes
   */
  toBytes(): Uint8Array {
    if (!this.mdBytes) this.mdBytes = this.encode()
    return this.mdBytes
  }

  /**
   * Encode multidid as multibase string, defaults to base58btc, multibase prefix string
   */
  toMultibase(base: SupportedBase = 'base58btc'): string {
    const encoder = base === 'base58btc' ? base58btc : base16
    return encoder.encode(this.toBytes())
  }

  /**
   * Decode multibase multidid string into instance, expects multibase prefix 
   */
  static fromMultibase(multidid: string): Multidid {
    let bytes
    switch (multidid.slice(0, 1)) {
      case base58btc.prefix: {
        bytes = base58btc.decode(multidid)
        break
      }
      case base16.prefix: {
        bytes = base16.decode(multidid)
        break
      }
      default: {
        throw new Error('Multibase encoding not found, base58btc and base16 supported')
      }
    }
    return this.fromBytes(bytes)
  }

  /**
   * Decode multidid instance from a did string
   */
  static fromString(did: string): Multidid {
    const [, method, suffix] = did.split(':')
    const [id, url] = suffix.split(/(?=[#?/])(.*)/)
    switch (method) {
      case 'key': {
        const keyBytes = base58btc.decode(id)
        const [code, codeLen] = varint.decode(keyBytes, 0)
        const urlBytes = u8a.fromString(url || '', 'utf8')
        const idBytes = keyBytes.slice(codeLen)
        return new Multidid(code, idBytes, urlBytes)
      }
      case 'pkh': {
        throw new Error('TODO')
      }
      default: {
        const urlBytes = u8a.fromString(`${method}:${suffix}`, 'utf8')
        return new Multidid(ALL_METHOD_CODE, alloc(0), urlBytes)
      }
    }
  }

  /**
   * DID string from multidid
   */
  toString(): string {
    if (this.code === ALL_METHOD_CODE) {
      return `did:${u8a.toString(this.url, 'utf8')}`
    } else if (this.code === PKH_METHOD_CODE) {
      throw new Error('TODO')
    } else if (Object.keys(KEY_METHOD_CODES_LENGTH).includes(this.code.toString())) {
      const methodIdOffset = varint.encodingLength(this.code)
      const key = alloc(KEY_METHOD_CODES_LENGTH[this.code] + methodIdOffset)
      varint.encodeTo(this.code, key, 0)
      key.set(this.id, methodIdOffset)
      return `did:key:${base58btc.encode(key)}${u8a.toString(this.url, 'utf8')}`
    } else {
      throw new Error('Unable to convert to did string, no matching method')
    }
  }

  /**
   * Get the multidid by parts, res.methodCode, res.methodIdBytes, res.urlBytes
   */
  inspect(): InspectObject {
    return {
      methodCode: this.code,
      methodIdBytes: this.id,
      urlBytes: this.url
    }
  }
}
