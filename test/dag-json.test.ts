import CID from 'cids'
import multihash from 'multihashes'

import { encodeDagJson } from '../src/dag-json'

describe('dag-json', () => {
  test('encodeDagJson throws on circular objects', () => {
    const foo: any = {}
    const bar = { foo }
    foo.bar = bar

    expect(() => encodeDagJson(foo)).toThrow('Object contains circular references.')
  })

  test('encodeDagJson encodes CIDs as links', () => {
    const bytes = new Uint8Array(Buffer.from('test').buffer)
    const hash = multihash.encode(bytes, 'sha1')
    const cid = new CID(1, 'raw', hash)
    expect(encodeDagJson({ foo: 'bar', baz: cid })).toEqual({
      foo: 'bar',
      baz: { '/': cid.toString() },
    })
  })

  test('encodeDagJson encodes buffers as base64 links', () => {
    const buffer = Buffer.from('test')
    expect(encodeDagJson({ foo: 'bar', baz: buffer })).toEqual({
      foo: 'bar',
      baz: { '/': { base64: buffer.toString('base64') } },
    })
  })

  test('encodeDagJson recursively encode objects', () => {
    const data = { foo: 'bar', baz: { test: null } }
    expect(encodeDagJson(data)).toEqual(data)
  })
})
