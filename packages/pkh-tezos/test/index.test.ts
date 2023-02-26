import { InMemorySigner } from '@taquito/signer'
import { verifySignature, getPkhfromPk } from '../src/verifier'
import { char2Bytes, verifySignature as taquitoVerifySignature, getPkhfromPk as taquitoGetPkhfromPk } from '@taquito/utils'

describe('Tezos Cacao Auth Verify', () => {

  const signer = new InMemorySigner(
    'edskS3DtVSbWbPD1yviMGebjYwWJtruMjDcfAZsH9uba22EzKeYhmQkkraFosFETmEMfFNVcDYQ5QbFerj9ozDKroXZ6mb5oxV'
  )
  test('Signer Verify', async () => {
    const signed = await signer.sign(char2Bytes('hello'))
    const pubkey = await signer.publicKey()

    const taquitoRes = taquitoVerifySignature(char2Bytes('hello'), pubkey, signed.prefixSig)
    expect(taquitoRes).toBeTruthy()

    const res = verifySignature(char2Bytes('hello'), pubkey, signed.sig)
    expect(res).toBeTruthy()

    const resPrefix = verifySignature(char2Bytes('hello'), pubkey,  signed.prefixSig)
    expect(resPrefix).toBeTruthy()
  })

  test('PKH (tezos address) from PK', async () => {
    const pubkey = await signer.publicKey()
    expect(taquitoGetPkhfromPk(pubkey)).toEqual(getPkhfromPk(pubkey))
  })
})
