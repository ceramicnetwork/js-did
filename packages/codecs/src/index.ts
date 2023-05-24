/**
 * Common codecs for DID packages.
 *
 * ## Purpose
 *
 * Codecs for encoding, decoding and validating types used by the DID packages.
 *
 * ## Installation
 *
 * ```sh
 * npm install @didtools/codecs
 * ```
 *
 * ## Usage
 *
 * Validate a string is a valid DID:
 *
 * ```js
 * import { didString } from '@didtools/codecs'
 * import { isRight, validate } from 'codeco'
 *
 * const result = validate(didString, 'did:key:...')
 * const isValid = isRight(result)
 * ```
 *
 * Encode and decode a Uint8Array as base64-encoded string:
 *
 * ```js
 * import { uint8ArrayAsBase64 } from '@didtools/codecs'
 * import { decode } from 'codeco'
 *
 * const bytes = new Uint8Array(...)
 * const encoded = uint8ArrayAsBase64.encode(bytes)
 * const decoded = decode(uint8ArrayAsBase64, encoded)
 * ```
 *
 * @module codecs
 */

export * from './binary.js'
export * from './cacao.js'
export * from './did.js'
export * from './ipld.js'
export * from './jws.js'
