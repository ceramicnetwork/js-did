/**
 * Utility functions for `did:key` DIDs.
 *
 * ## Installation
 *
 * ```sh
 * npm install @didtools/key-did
 * ```
 *
 * ## Usage
 *
 * ### Create a DID with an optional seed
 *
 * ```js
 * import { createDID } from '@didtools/key-did'
 *
 * const seed = // 32 bytes of entropy, Uint8Array
 * const did = createDID(seed)
 *
 * // Authenticate with the provider
 * await did.authenticate()
 * ```
 *
 * ### Generate a random private key and create an authenticated DID
 *
 * ```js
 * import { generatePrivateKey, getAuthenticatedDID } from '@didtools/key-did'
 *
 * const randomKey = generatePrivateKey()
 * const did = await getAuthenticatedDID(randomKey)
 * ```
 *
 * @module key-did
 */

import { DID } from 'dids'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import { getResolver } from 'key-did-resolver'

export function createDID(seed?: Uint8Array): DID {
  const did = new DID({ resolver: getResolver() })
  if (seed != null) {
    did.setProvider(new Ed25519Provider(seed))
  }
  return did
}

export function generatePrivateKey(): Uint8Array {
  return globalThis.crypto.getRandomValues(new Uint8Array(32))
}

export async function getAuthenticatedDID(seed: Uint8Array): Promise<DID> {
  const did = createDID(seed)
  await did.authenticate()
  return did
}
