import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import { webcrypto } from 'crypto'

Object.defineProperty(globalThis, 'crypto', {
  value: webcrypto
});