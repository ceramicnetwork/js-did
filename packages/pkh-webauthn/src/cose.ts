/**
 * Tiny partial CBOR decoder that supports COSE_key numerical keys
 */

// Section 'COSE Key Type Parameters'
// https://www.iana.org/assignments/cose/cose.xhtml
const COSE_HEADER: any = {
 '1': 'kty',
 '3': 'alg',
 '-1': 'curve',
 '-2': 'x',
 '-3': 'y'
}
export function decodeCOSE (buf: Uint8Array) {
  if (!(buf instanceof Uint8Array)) throw new Error('Uint8ArrayExpected')
  const view = new DataView(buf.buffer)
  let o = 0
  const readByte = (): number => buf[o++]
  const readU8 = (): number => view.getUint8(o++)
  const readU16 = () => {
    const n = view.getUint16(o)
    o+= 2
    return n
  }
  const readU32 = () => {
    const n = view.getUint32(o)
    o += 4
    return n
  }
  const readU64 = () => {
    const n = view.getBigUint64(o)
    o += 8
    return n
  }
  const readLength = (l:number) => l < 24 ? l : [readU8, readU16, readU32, readU64][l - 24]()
  const readMap = (nPairs: number) => {
    const map: any = {}
    for (let i = 0; i < nPairs; i++) {
        const key = readItem().toString()
        const strKey = COSE_HEADER[key]
        if (!strKey) throw new Error(`Unknown key ${key}`)
        map[strKey] = readItem()
    }
    return map
  }
  const readBuffer = (l: number) => buf.slice(o, o += l)
  function readItem () {
    const b = readByte()
    const l = readLength(b & 0x1f)
    switch (b >> 5) {
      case 0: return l // Uint
      // Negative integer
      case 1: return typeof l === 'bigint' ? -(l +1n) : -(assertNumber(l) + 1)
      case 2: return readBuffer(assertNumber(l)) // binstr
      case 5: return readMap(assertNumber(l))
      default: throw new Error('UnsupportedType' + (b >> 5))
    }
  }
  function assertNumber (o: any): number {
    if (typeof o !== 'number') throw new Error('Number expected')
    return o
  }
  return readItem()
}
