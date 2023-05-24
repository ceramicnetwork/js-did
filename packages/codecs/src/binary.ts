import { type SupportedEncodings, fromString, toString } from 'uint8arrays'
import { type Context, TrivialCodec, Type } from 'codeco'

/**
 * Check if the input is a JS `Uint8Array`.
 */
export function isUint8Array(input: unknown): input is Uint8Array {
  return input instanceof Uint8Array
}

/**
 * codeco codec for JS `Uint8Array`.
 */
export const uint8array = new TrivialCodec('Uint8Array', isUint8Array)

/**
 * Factory for codeco codec for Uint8Array as encoded string.
 */
export function createUint8ArrayAsString(
  encoding: SupportedEncodings
): Type<Uint8Array, string, string> {
  return new Type<Uint8Array, string, string>(
    `Uint8Array-as-${String(encoding)}`,
    isUint8Array,
    (input: string, context: Context) => {
      try {
        return context.success(fromString(input, encoding))
      } catch {
        return context.failure()
      }
    },
    (value: Uint8Array): string => toString(value, encoding)
  )
}

/**
 * codeco codec for Uint8Array as base64-encoded string.
 */
export const uint8ArrayAsBase64 = createUint8ArrayAsString('base64')

/**
 * codeco codec for Uint8Array as base64pad-encoded string.
 */
export const uint8ArrayAsBase64pad = createUint8ArrayAsString('base64pad')

/**
 * codeco codec for Uint8Array as base64url-encoded string.
 */
export const uint8ArrayAsBase64url = createUint8ArrayAsString('base64url')
