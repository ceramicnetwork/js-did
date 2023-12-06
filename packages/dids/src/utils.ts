import { toString } from 'uint8arrays/to-string'
import { decode } from 'codeco'
import { type DagJWS, uint8ArrayAsBase64pad, uint8ArrayAsBase64url } from '@didtools/codecs'

export * from './random-string.util.js'

export function encodeBase64(bytes: Uint8Array): string {
  return uint8ArrayAsBase64pad.encode(bytes)
}

export function encodeBase64Url(bytes: Uint8Array): string {
  return uint8ArrayAsBase64url.encode(bytes)
}

export function decodeBase64(s: string): Uint8Array {
  return decode(uint8ArrayAsBase64pad, s)
}

export function base64urlToJSON(s: string): Record<string, any> {
  const decoded = decode(uint8ArrayAsBase64url, s)
  return JSON.parse(toString(decoded)) as Record<string, any>
}

export function fromDagJWS(jws: DagJWS): string {
  if (jws.signatures.length > 1) throw new Error('Cant convert to compact jws')
  return `${jws.signatures[0].protected}.${jws.payload}.${jws.signatures[0].signature}`
}

/**
 * Make DID URL from DID and timestamp (= versionTime query)
 */
export function didWithTime(did: string, atTime?: Date): string {
  if (atTime) {
    const versionTime = atTime.toISOString().split('.')[0] + 'Z'
    return `${did}?versionTime=${versionTime}`
  } else {
    return did
  }
}

/**
 * `controller` field of DID Document can be one or multiple strings, if defined.
 * Here we transform it into array of strings.
 * Potentially it can be an empty array.
 */
export function extractControllers(
  controllerProperty: string | Array<string> | undefined,
): Array<string> {
  if (controllerProperty) {
    if (Array.isArray(controllerProperty)) {
      return controllerProperty
    } else {
      return [controllerProperty]
    }
  } else {
    return []
  }
}
