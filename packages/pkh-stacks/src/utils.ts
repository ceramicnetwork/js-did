// bytesToHex is a utility function taken from @stacks/common https://github.com/hirosystems/stacks.js/blob/0e1f9f19dfa45788236c9e481f9a476d9948d86d/packages/common/src/utils.ts#L466

// The following methods are based on `@noble/hashes` implementation
// https://github.com/paulmillr/noble-hashes
// Copyright (c) 2022 Paul Miller (https://paulmillr.com)
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the “Software”), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
const hexes = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, '0'))

/**
 * Converts bytes to the equivalent hex string
 * @example
 * ```
 * bytesToHex(Uint8Array.from([0xde, 0xad, 0xbe, 0xef])) // 'deadbeef'
 * ```
 */
export function bytesToHex(uint8a: Uint8Array): string {
  // pre-caching improves the speed 6x
  if (!(uint8a instanceof Uint8Array)) throw new Error('Uint8Array expected')
  let hex = ''
  for (const u of uint8a) {
    hex += hexes[u]
  }
  return hex
}
