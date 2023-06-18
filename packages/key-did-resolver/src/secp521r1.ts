// Brent Shambaugh <brent.shambaugh@gmail.com>. 2021.

import { toString } from 'uint8arrays'
import { secp521r1 } from '@noble/curves/p521'
import { numberToVarBytesBE } from '@noble/curves/abstract/utils'

/**
 * Constructs the document based on the method key
 */
export function keyToDidDoc(pubKeyBytes: Uint8Array, fingerprint: string): any {
  const did = `did:key:${fingerprint}`
  const keyId = `${did}#${fingerprint}`
  const point = secp521r1.ProjectivePoint.fromHex(pubKeyBytes)
  return {
    id: did,
    verificationMethod: [
      {
        id: keyId,
        type: 'JsonWebKey2020',
        controller: did,
        publicKeyJwk: {
          kty: 'EC',
          crv: 'P-521',
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
