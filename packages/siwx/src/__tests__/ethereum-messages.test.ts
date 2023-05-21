import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { readFileSync } from 'fs'
import { sparse, string, optional, type, literal, record, union, decode, type TypeOf } from 'codeco'
import { SiwxMessage } from '../siwx-message.js'

const Fields = sparse({
  domain: string,
  address: string,
  uri: string,
  version: string,
  chainId: string,
  nonce: string,
  issuedAt: string,
  network: string,
  statement: optional(string),
})

const ValidEntry = type({
  message: string,
  status: literal('valid'),
  fields: Fields,
})

const InvalidEntry = type({
  message: string,
  status: literal('invalid'),
})

const ChainVector = record(string, union([ValidEntry, InvalidEntry]))
type ChainVector = TypeOf<typeof ChainVector>

function readVector(filename: URL): ChainVector {
  const contents = readFileSync(filename, 'utf8')
  const parsed = JSON.parse(contents)
  return decode(ChainVector, parsed)
}

const ethereumVectors = readVector(
  new URL('../../data/vectors/ethereum-messages.json', import.meta.url)
)

for (const [name, entry] of Object.entries(ethereumVectors)) {
  const isValid = ValidEntry.is(entry)
  if (isValid) {
    test(name, () => {
      // fromString -> toFields
      const fromString = SiwxMessage.fromString(entry.message)

      // fromFields -> toString
      const fromFields = new SiwxMessage(entry.fields)
      const toString = fromFields.toString()

      assert.equal(toString, entry.message, 'toString do not match with provided message')
      assert.equal(fromString, fromFields, 'fromString do not match with provided fields')
    })
  } else {
    assert.throws(() => SiwxMessage.fromString(entry.message), `Expect invalid: ${name}`)
  }
}

test.run()
