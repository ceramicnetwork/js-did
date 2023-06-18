// Brent Shambaugh <brent.shambaugh@gmail.com>. 2021.

import { p384 } from '@noble/curves/p384'
import { concat, toString } from 'uint8arrays'
import { numberToVarBytesBE } from '@noble/curves/abstract/utils'

/**
 * Constructs the document based on the method key
 */
export function keyToDidDoc(pubKeyBytes: Uint8Array, fingerprint: string): any {
  const did = `did:key:${fingerprint}`
  const keyId = `${did}#${fingerprint}`
  const point = p384.ProjectivePoint.fromHex(normalizePubKeyBytes(pubKeyBytes))
  return {
    id: did,
    verificationMethod: [
      {
        id: keyId,
        type: 'JsonWebKey2020',
        controller: did,
        publicKeyJwk: {
          kty: 'EC',
          crv: 'P-384',
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
 * If raw p384 key (i.e., contains 96 bytes), convert it to uncompressed one by adding 0x04 prefix
 */
function normalizePubKeyBytes(pubKeyBytes: Uint8Array): Uint8Array {
  if (pubKeyBytes.length === 96) {
    return concat([new Uint8Array([4]), pubKeyBytes])
  } else {
    return pubKeyBytes
  }
}
