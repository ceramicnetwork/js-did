// Brent Shambaugh <brent.shambaugh@gmail.com>. 2021.

import { p256 } from '@noble/curves/p256'
import { toString, concat } from 'uint8arrays'
import { numberToVarBytesBE } from '@noble/curves/abstract/utils'

/**
 * Constructs the document based on the method key
 */
export function keyToDidDoc(pubKeyBytes: Uint8Array, fingerprint: string): any {
  const did = `did:key:${fingerprint}`
  const keyId = `${did}#${fingerprint}`
  const point = p256.ProjectivePoint.fromHex(normalizePubKeyBytes(pubKeyBytes))
  return {
    id: did,
    verificationMethod: [
      {
        id: keyId,
        type: 'JsonWebKey2020',
        controller: did,
        publicKeyJwk: {
          kty: 'EC',
          crv: 'P-256',
          x: toString(numberToVarBytesBE(point.x), 'base64url'),
          y: toString(numberToVarBytesBE(point.y), 'base64url'),
        },
      },
    ],
    authentication: [keyId],
    assertionMethod: [keyId],
    capabilityDelegation: [keyId],
    capabilityInvocation: [keyId],
  }
}

/**
 * If raw p256 key, convert it to uncompressed one by adding 0x04 prefix
 */
function normalizePubKeyBytes(pubKeyBytes: Uint8Array): Uint8Array {
  if (pubKeyBytes.length === 64) {
    return concat([new Uint8Array([4]), pubKeyBytes])
  } else {
    return pubKeyBytes
  }
}
