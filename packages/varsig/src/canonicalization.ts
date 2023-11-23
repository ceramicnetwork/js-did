import { BytesTape } from './bytes-tape.js'
import { SigningAlgo } from './signing.js'
import { HashingAlgo } from './hashing.js'
import * as uint8arrays from 'uint8arrays'
import { keccak_256 } from '@noble/hashes/sha3'
import { UnreacheableCaseError } from './unreachable-case-error.js'
import { hashTypedData } from 'viem'
import { decompressDomain, decompressTypes } from './encoding/eip712.js'

export enum CanonicalizationKind {
  EIP712 = 0xe712,
  EIP191 = 0xe191,
}

type CanonicalizationEIP191 = {
  kind: CanonicalizationKind.EIP191
  (message: string): Uint8Array
}

type CanonicalizationEIP712 = {
  kind: CanonicalizationKind.EIP712
  (message: string): Uint8Array
}

type Canonicalization = CanonicalizationEIP191 | CanonicalizationEIP712

export class CanonicalizationDecoder {
  constructor(private readonly tape: BytesTape) {}

  read(): Canonicalization {
    const sigil = this.tape.readVarint<CanonicalizationKind>()
    switch (sigil) {
      case CanonicalizationKind.EIP712: {
        const metadataLength = this.tape.readVarint()
        const metadataBytes = this.tape.read(metadataLength)
        const metadata = JSON.parse(uint8arrays.toString(metadataBytes))
        const [types, primaryType, domain] = metadata
        const signingInput = (message: any) => {
          const digestHex = hashTypedData({
            domain: decompressDomain(domain),
            message: message,
            primaryType: primaryType,
            types: decompressTypes(types),
          })
          return uint8arrays.fromString(digestHex.toLowerCase().replace(/^0x/, ''), 'hex')
        }
        signingInput.kind = CanonicalizationKind.EIP712
        return signingInput
      }
      case CanonicalizationKind.EIP191: {
        const signingInput = (message: string) => {
          return keccak_256(
            uint8arrays.fromString(
              `\x19Ethereum Signed Message:\n` + String(message.length) + message
            )
          )
        }
        signingInput.kind = CanonicalizationKind.EIP191
        return signingInput
      }
      default:
        throw new UnreacheableCaseError(sigil, 'canonicalization kind')
    }
  }
}
