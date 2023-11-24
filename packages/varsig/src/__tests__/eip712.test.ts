import { readFile } from 'node:fs/promises'
import { test } from '@jest/globals'
import { CARFactory } from 'cartonne'
// import { Decoder } from '../decoder'
// import { BytesTape } from '../bytes-tape'
// import { CanonicalizationKind } from '../canonicalization'
// import { secp256k1 } from '@noble/curves/secp256k1'

const factory = new CARFactory()

test.skip('eip712-secp256k1.car', async () => {
  const carFilepath = new URL('../../test/__vectors__/eip712-secp256k1.car', import.meta.url)
  const carBytes = await readFile(carFilepath)
  const car = factory.fromBytes(carBytes)
  const root = car.get<any>(car.roots[0])
  if (!root) throw new Error(`Empty root`)
  for (const entryCID of root.entries) {
    const a = car.get<any>(entryCID)
    if (a.valid) {
      const dataCID = a.data
      const nodeCID = a.node
      const data = car.get(dataCID)
      const node = car.get(nodeCID)
      // const varsig = new Decoder(new BytesTape(node._sig)).read()
      // if (varsig.canonicalization.kind !== CanonicalizationKind.EIP712) throw new Error(`Not 712`)
      // const input = varsig.canonicalization(data.message)
      // let signature = secp256k1.Signature.fromCompact(varsig.signature)
      // varsig.signing.verify(input, varsig.signature, )
      // if (varsig.signing.recoveryBit) {
      //   signature = signature.addRecoveryBit(varsig.signing.recoveryBit - 27)
      // }
      // console.log('pub.1', signature.recoverPublicKey(input).toHex(false))
      console.log('pub.0', data, node)
    }
  }
})
