import { decode } from 'varintes/decode'
import type { Tape } from 'codeco/linear'

export class BytesTape implements Tape<Uint8Array> {
  position: number

  constructor(readonly input: Uint8Array) {
    this.position = 0
  }

  read(n: number): Uint8Array {
    const result = this.input.subarray(this.position, this.position + n)
    this.position += n
    return result
  }

  readVarint<T extends number = number>(): T {
    const bytes = this.read(10)
    const [n, bytesRead] = decode(bytes)
    this.position -= 10 - bytesRead
    return n as T
  }

  get isEOF(): boolean {
    return this.position >= this.input.byteLength
  }
}
