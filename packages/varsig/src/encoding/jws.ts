// import type { GeneralJWS } from 'dids'
// import * as uint8arrays from 'uint8arrays'
// import { toBytes } from '../bytes.js'
// import { ENCODING, HASHING, SIGNING } from '../varsig.js'
//
// export function encode(jws: GeneralJWS) {
//   const signature0 = jws.signatures[0]
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//   const protectedHeader = JSON.parse(
//     uint8arrays.toString(uint8arrays.fromString(signature0.protected, 'base64url'))
//   )
//   const payload = JSON.parse(uint8arrays.toString(uint8arrays.fromString(jws.payload, 'base64url')))
//   const signature = uint8arrays.fromString(signature0.signature, 'base64url')
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//   switch (protectedHeader.alg) {
//     case 'EdDSA': {
//       const sig = toBytes({
//         encoding: ENCODING.JWT,
//         hashing: HASHING.SHA2_256,
//         signing: SIGNING.ED25519,
//         signature: signature,
//       })
//       delete protectedHeader.typ
//       delete protectedHeader.alg
//       return {
//         _header: protectedHeader,
//         ...payload,
//         _signature: sig,
//       }
//     }
//     case 'ES256': {
//       const sig = toBytes({
//         encoding: ENCODING.JWT,
//         hashing: HASHING.SHA2_256,
//         signing: SIGNING.RSA
//       })
//     }
//   }
//   return {
//     _header: {},
//     _sig: {},
//   }
// }
