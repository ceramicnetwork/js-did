import { decode } from 'varintes/decode'
import type { Tape } from 'codeco/linear'

export class BytesTape implements Tape<Uint8Array> {
  position: number

  constructor(readonly input: Uint8Array) {
    this.position = 0
  }

  read(n: number, exact = false): Uint8Array {
    const result = this.input.subarray(this.position, this.position + n)
    if (exact && result.byteLength < n) {
      throw new Error(`EOF reached while trying to read ${n} bytes`)
    }
    this.position += n
    return result
  }

  readVarint<T extends number = number>(): T {
    const bytes = this.read(10)
    if (bytes.byteLength === 0) {
      throw new Error(`EOF reached while trying to get varint bytes`)
    }
    const [n, bytesRead] = decode(bytes)
    this.position -= 10 - bytesRead
    return n as T
  }

  get remainder(): Uint8Array {
    return this.input.subarray(this.position)
  }

  get isEOF(): boolean {
    return this.position >= this.input.byteLength
  }
}
