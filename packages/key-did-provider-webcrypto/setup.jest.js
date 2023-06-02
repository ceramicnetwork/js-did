import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import { Crypto } from '@peculiar/webcrypto'

Object.defineProperty(globalThis, 'crypto', {
    value: new Crypto()
  });