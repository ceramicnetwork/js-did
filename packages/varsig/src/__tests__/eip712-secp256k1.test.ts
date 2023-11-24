import { readFile } from 'node:fs/promises'
import { expect, test } from '@jest/globals'
import { CARFactory } from 'cartonne'
import { CID } from 'multiformats/cid'
import { BytesTape } from '../bytes-tape'
import { Decoder } from '../decoder'
import * as uint8arrays from 'uint8arrays'
import { CanonicalizationKind } from '../canonicalization.js'

const factory = new CARFactory()

test('eip712-secp256k1.car', async () => {
  const carFilepath = new URL('./vectors/eip712-secp256k1.car', import.meta.url)
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
    if (!entry['data']) continue
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const data = car.get(entry.data)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const node = car.get(entry.node)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const varsig = new Decoder(new BytesTape(node._sig)).read()
    if (varsig.canonicalization.kind !== CanonicalizationKind.EIP712) throw new Error(`Not 712`)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const input = varsig.canonicalization(data.message)
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