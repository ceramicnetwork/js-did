import { webcrypto } from 'crypto'
import { TextEncoder, TextDecoder } from 'node:util'

globalThis.TextEncoder = TextEncoder
globalThis.TextDecoder = TextDecoder

Object.defineProperty(globalThis, 'crypto', {
  value: webcrypto,
})

global.window = globalThis

import indexedDB from 'fake-indexeddb'
global.indexedDB = indexedDB
