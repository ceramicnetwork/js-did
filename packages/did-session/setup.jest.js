import { webcrypto } from 'crypto'

Object.defineProperty(globalThis, 'crypto', {
  value: webcrypto
});

global.window = globalThis

import indexedDB from 'fake-indexeddb'
global.indexedDB = indexedDB