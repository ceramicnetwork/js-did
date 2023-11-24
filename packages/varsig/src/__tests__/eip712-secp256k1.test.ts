import { readFile } from 'node:fs/promises'
import { expect, test } from '@jest/globals'
import { CARFactory, type CAR } from 'cartonne'
import { CID } from 'multiformats/cid'
import * as uint8arrays from 'uint8arrays'
import { Eip712 } from '../canons/eip712.js'
import { verify, toOriginal } from '../varsig.js'
import { klona } from 'klona'

const factory = new CARFactory()

describe('eip712-secp256k1.car', () => {
  let car: CAR, entries: Array<CID>

  beforeAll(async () => {
    const carFilepath = new URL('./__vectors__/eip712-secp256k1.car', import.meta.url)
    const carBytes = await readFile(carFilepath)
    car = factory.fromBytes(carBytes)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const root = car.get(car.roots[0])
    if (!root) throw new Error(`Empty root`)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    entries = root.entries as Array<CID>
  })

  test('Verify signatures', async () => {
    for (const entryCID of entries) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const entry = car.get(entryCID)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
      const node = car.get(entry.node)

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const verificationKey =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-call
        entry.signer.address ||
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        uint8arrays.fromString(entry.signer.publicKey.replace(/^0x/, ''), 'hex')

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (entry.valid) {
        // eslint-disable-next-line jest/no-conditional-expect,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
        await expect(verify(node, verificationKey)).resolves.toEqual(entry.valid)
      } else {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const verification = await verify(node, verificationKey)
          // eslint-disable-next-line jest/no-conditional-expect
          expect(verification).toEqual(false)
        } catch (e) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(e).toBeTruthy()
        }
      }
    }
  })

  test('Create varsig ipld node', () => {
    for (const entryCID of entries) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const entry = car.get(entryCID)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      if (!entry.original) continue
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
      const original = car.get(entry.original)
      const varsigNode = Eip712.fromOriginal(original as Eip712)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
      const node = car.get(entry.node)
      expect(varsigNode).toEqual(node)
    }
  })

  test('Recover original from ipld node', async () => {
    for (const entryCID of entries) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const entry = car.get(entryCID)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      if (!entry.original) continue
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
      const originalExpected = car.get(entry.original)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
      const node = car.get(entry.node)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const originalKlone = klona(originalExpected)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
      if (Object.keys(originalKlone.signature).includes('r')) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        const r = uint8arrays.fromString(originalKlone.signature.r.replace(/^0x/, ''), 'hex')
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        const s = uint8arrays.fromString(originalKlone.signature.s.replace(/^0x/, ''), 'hex')
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        originalKlone.signature =
          '0x' +
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
          uint8arrays.toString(uint8arrays.concat([r, s, [originalKlone.signature.v]]), 'hex')
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument
      const originalRecovered = await toOriginal(node)
      expect(originalRecovered).toEqual(originalKlone)
    }
  })
})
