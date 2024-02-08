import { readFile } from 'node:fs/promises'
import { expect, test } from '@jest/globals'
import { CARFactory, type CAR } from 'cartonne'
import { CID } from 'multiformats/cid'
import * as uint8arrays from 'uint8arrays'
import { JWS } from '../canons/jws.js'
import { verify, toOriginal } from '../varsig.js'
import { MAGIC } from '../magic.js'
import { BytesTape } from '../bytes-tape.js'
import { klona } from 'klona'
import * as varintes from 'varintes'


const factory = new CARFactory()

describe('jws.car', () => {
  let car: CAR, entries: Array<CID>

  beforeAll(async () => {
    const carFilepath = new URL('./__vectors__/jws.car', import.meta.url)
    const carBytes = await readFile(carFilepath)
    car = factory.fromBytes(carBytes)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const root = car.get(car.roots[0])
    if (!root) throw new Error(`Empty root`)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    entries = root.entries as Array<CID>
  })

  test('GenerateVectors', async () => {
    await createVectors()
  })


  test.skip('Verify signatures', async () => {
    for (const entryCID of entries) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const entry = car.get(entryCID)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
      const node = car.get(entry.node)
      console.log(entry)

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const verificationKey = entry.signer.verificationKey

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (entry.valid) {
        // eslint-disable-next-line jest/no-conditional-expect,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
        await expect(verify(node, verificationKey)).resolves.toEqual(entry.valid)
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const verificationP = verify(node, verificationKey).catch(() => false)
        // eslint-disable-next-line jest/no-conditional-expect
        await expect(verificationP).resolves.toEqual(false)
      }
    }
  })

  test.skip('Create varsig ipld node', () => {
//     for (const entryCID of entries) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//       const entry = car.get(entryCID)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
//       if (!entry.original) continue
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
//       const original = car.get(entry.original)
  //     const varsigNode = Eip712.fromOriginal(original as Eip712)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
//       const node = car.get(entry.node)
//       expect(varsigNode).toEqual(node)
//     }
  })

  test.skip('Recover original from ipld node', async () => {
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


import * as jose from 'jose'
import { generateKeyPairSync } from 'node:crypto'
import { encode, decode } from '@ipld/dag-json'
import { pipeline } from "node:stream/promises";
import * as fs from "node:fs";

async function createVectors() {
  const car = factory.build()
  const entries = []
  await gen('ec', { namedCurve: 'P-256' }, 'ES256')
  await gen('ed25519', {}, 'EdDSA')
  await gen('ed25519', {}, 'EdDSA', 'ed25519')
  await gen('ec', { namedCurve: 'secp256k1' }, 'ES256K')
  await gen('ed448', {}, 'EdDSA', 'ed448')

  console.log(entries)

  car.put({
    entries,
    canonicalization: 'jws',
    hash: ['sha2-256', 'shake-256'],
    signature: ['es256', 'secp256k1', 'ed25519', 'ed448']
  }, { isRoot: true })

  await pipeline(car, fs.createWriteStream("./jws.car"));

  async function gen(name, opt, alg, crv) {
    const kp = generateKeyPairSync(name, opt)
    const {x, y } = kp.publicKey.export({ format: 'jwk' })
    const verificationKey = y ?
      uint8arrays.concat([
        [0x04],
        uint8arrays.fromString(x, 'base64url'),
        uint8arrays.fromString(y, 'base64url')
      ]) :
      uint8arrays.fromString(x, 'base64url')

    const payload = JSON.parse(uint8arrays.toString(encode({
      testLink: CID.parse('bafyqacnbmrqxgzdgdeaui'),
      iat:1707403055,
      aud:"urn:example:audience",
      exp:1707410255
    })))
    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg })
      .sign(kp.privateKey)


    console.log('test: jwt', jwt)
    const node = JWS.fromOriginal(jwt)

    await expect(verify(node, verificationKey)).resolves.toEqual(true)
    console.log('passed one')

    const entry1 = car.put({
      valid: true,
      signer: { verificationKey },
      node: car.put(node),
      original: car.put(jwt)
    })
    const nodeKeccak = klona(node)
    let tape = new BytesTape(nodeKeccak._sig)
    tape.read(1); tape.readVarint();
    const hashPosition = tape.position
    nodeKeccak._sig.set([MAGIC.KECCAK_256], hashPosition) // TODO - fix
    const entry2 = car.put({
      valid: false,
      error: 'Invalid hash code',
      signer: { verificationKey },
      node: car.put(nodeKeccak),
      original: car.put(jwt)
    })
    const jwtInvalid = jwt.substring(0, jwt.length - 10) + 'abc' + jwt.substring(jwt.length - 7)
    const entry3 = car.put({
      valid: false,
      error: 'Invalid signature',
      signer: { verificationKey },
      node: car.put(JWS.fromOriginal(jwtInvalid)),
      original: car.put(jwtInvalid)
    })
    const invalidProtectedBytes = uint8arrays.fromString(JSON.stringify({}))
    const invalidProtected = uint8arrays.toString(invalidProtectedBytes, 'base64url')
    const jwtMissingAlg = invalidProtected + jwt.substring(jwt.indexOf('.'))
    const nodeMissingAlg = klona(node)
    const protectedLength = varintes.encode(invalidProtectedBytes.length)[0]
    tape = new BytesTape(nodeKeccak._sig)
    tape.read(1); tape.readVarint(); tape.readVarint(); tape.readVarint();
    const protLenPos = tape.position
    const klonLength = tape.readVarint()
    const signature = nodeMissingAlg._sig.slice(tape.position + klonLength)
    const newVarsig = uint8arrays.concat([
      nodeMissingAlg._sig.slice(0, protLenPos),
      varintes.encode(invalidProtectedBytes.length)[0],
      invalidProtectedBytes,
      signature
    ])
    nodeMissingAlg._sig = newVarsig
    const entry4 = car.put({
      valid: false,
      error: 'Missing alg in protected header',
      signer: { verificationKey },
      node: car.put(nodeMissingAlg),
      original: car.put(jwtMissingAlg)
    })
    entries.push(entry1, entry2, entry3, entry4)
  }
}
