import { readFile } from 'node:fs/promises'
import { expect, test } from '@jest/globals'
import { CARFactory } from 'cartonne'
import { CID } from 'multiformats/cid'
import { BytesTape } from '../bytes-tape'
import { Decoder } from '../decoder'
import * as uint8arrays from 'uint8arrays'
import { CanonicalizationKind } from '../canonicalization.js'
import { Eip712, EIP712_DOMAIN, fromOriginal } from '../canons/eip712.js'
import { toOriginal } from '../varsig.js'
import { klona } from 'klona'

const factory = new CARFactory()

test('eip712-secp256k1.car', async () => {
  const carFilepath = new URL('./__vectors__/eip712-secp256k1.car', import.meta.url)
  const carBytes = await readFile(carFilepath)
  const car = factory.fromBytes(carBytes)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const root = car.get(car.roots[0])
  if (!root) throw new Error(`Empty root`)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const entries = root.entries as Array<CID>
  for (const entryCID of entries) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const entry = car.get(entryCID)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    if (!entry.original) continue
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const original = car.get(entry.original)
    const recalculatedFromOriginal = fromOriginal(original as Eip712)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const node = car.get(entry.node)
    expect(node).toEqual(recalculatedFromOriginal)
    let originalKlone = klona(original)
    if (Object.keys(original.signature).includes('r')) {
      const r = uint8arrays.fromString(original.signature.r.replace(/^0x/, ''), 'hex')
      const s = uint8arrays.fromString(original.signature.s.replace(/^0x/, ''), 'hex')
      originalKlone.signature =
        '0x' + uint8arrays.toString(uint8arrays.concat([r, s, [original.signature.v]]), 'hex')
    }
    await expect(toOriginal(node)).resolves.toEqual(originalKlone)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const varsig = new Decoder(new BytesTape(node._sig)).read()
    if (varsig.canonicalization.kind !== CanonicalizationKind.EIP712) throw new Error(`Not 712`)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const input = varsig.canonicalization(original.message)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const signer = entry.signer
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    if (signer.publicKey) {
      const verificationResult = await varsig.signing.verify(
        input,
        varsig.signature,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        uint8arrays.fromString(signer.publicKey.replace(/^0x/, ''), 'hex')
      )
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,jest/no-conditional-expect
      expect(verificationResult).toEqual(entry.valid)
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (signer.address) {
      const verificationResult = await varsig.signing.verify(
        input,
        varsig.signature,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
        signer.address
      )
      // eslint-disable-next-line jest/no-conditional-expect,@typescript-eslint/no-unsafe-member-access
      expect(verificationResult).toEqual(entry.valid)
    }
  }
})
