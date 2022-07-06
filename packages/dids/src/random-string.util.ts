import { randomBytes } from '@stablelib/random'
import { toString } from 'uint8arrays/to-string'

export function randomString(): string {
  return toString(randomBytes(16), 'base64')
}
