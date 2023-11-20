import * as varintes from 'varintes'

export function encode(bytes: Uint8Array, out?: Uint8Array, offset?: number): [Uint8Array, number] {
  const byteLength = bytes.byteLength
  const [lenBytes, lenLen] = varintes.encode(byteLength)
  const destination = out ? out.subarray(offset) : new Uint8Array(lenLen + byteLength)
  destination.set(lenBytes, 0)
  destination.set(bytes, lenLen)
  return [destination, lenLen + byteLength]
}

export function decode(buffer: Uint8Array, offset = 0): [Uint8Array, number] {
  const bytes = buffer.subarray(offset)
  const [len, lenLen] = varintes.decode(bytes)
  const result = bytes.subarray(lenLen, len + lenLen)
  return [result, result.byteLength]
}
