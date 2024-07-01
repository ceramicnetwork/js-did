import { test } from '@jest/globals'
import { createDIDKey } from '../index.js'
import { createEthereumAuthMethod } from './create-ethereum-auth-method.js'
import { Cacao } from '@didtools/cacao'
import { uint8ArrayAsBase64url } from '@didtools/codecs'
import { decode } from 'codeco'
import { CARFactory, CAR } from 'cartonne'
import { getEIP191Verifier } from '@didtools/pkh-ethereum'
import { DID } from 'dids'
import KeyDidResolver from 'key-did-resolver'
import { CID } from 'multiformats/cid'
import stringify from 'fast-json-stable-stringify'

const textDecoder = new TextDecoder()
const textEncoder = new TextEncoder()
const carFactory = new CARFactory()

const didKeyVerifier = new DID({ resolver: KeyDidResolver.getResolver() })

async function jwsVerifier(cacao: Cacao) {
  const header = uint8ArrayAsBase64url.encode(
    new Uint8Array(textEncoder.encode(stringify(cacao.s?.m || {}))),
  )
  const signature = cacao.s?.s || ''
  const payload = uint8ArrayAsBase64url.encode(
    new Uint8Array(textEncoder.encode(stringify(cacao.p))),
  )
  await didKeyVerifier.verifyJWS({
    payload: payload,
    signatures: [
      {
        protected: header,
        signature: signature,
      },
    ],
  })
}

const VERIFIERS = {
  ...getEIP191Verifier(),
  jws: jwsVerifier,
}

async function verifyCACAOChain(car: CAR) {
  const root = car.roots[0]
  if (!root) throw new Error(`No root capability!`)
  let next: Cacao | undefined = car.get(root)
  while (next) {
    await Cacao.verify(next, { verifiers: VERIFIERS })
    if (next.p.resources) {
      const resources = next.p.resources
      const prevs = resources
        .filter((r) => r.match(/^prev:/))
        .map((p) => p.replace(/^prev:/, ''))
        .map((c) => CID.parse(c))
      const prevCID = prevs[0]
      if (prevCID) {
        const prev = car.get(prevCID)
        if (prev) {
          next = prev
        } else {
          throw new Error(`No prev CACAO provided`)
        }
      } else {
        next = undefined
      }
    } else {
      next = undefined
    }
  }
}

test('delegation', async () => {
  const authA = await createEthereumAuthMethod()
  const didKey = await createDIDKey()
  const authB = await createEthereumAuthMethod()

  // authA -> didKey
  const cacao1 = await authA.authMethod({
    uri: didKey.id,
    resources: ['biscuit://foo'],
  })
  const car = carFactory.build()
  const cacao1cid = car.put(cacao1)

  // didKey -> authB
  const cacao2p = {
    ...cacao1.p,
    aud: `did:pkh:${authB.account.toString()}`,
    iss: didKey.id,
    resources: [...(cacao1.p.resources || []), `prev:${cacao1cid.toString()}`],
  }
  const jws = await didKey.createJWS(cacao2p)
  const header = jws.signatures[0].protected
  const headerBytes = decode(uint8ArrayAsBase64url, header)
  const headerString = textDecoder.decode(headerBytes)
  const headerJSON = JSON.parse(headerString)
  const cacao2: Cacao = {
    h: {
      t: 'caip122',
    },
    p: cacao2p,
    s: {
      t: 'jws',
      s: jws.signatures[0].signature,
      m: headerJSON,
    },
  }

  // Pack into a CAR file
  car.put(cacao2, { isRoot: true })

  await verifyCACAOChain(car)
})
