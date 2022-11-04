/**
 * # PKH DID method resolver
 *
 * This package contains did:pkh method resolver implementation. Please refer to the [specification](https://github.com/w3c-ccg/did-pkh/blob/main/did-pkh-method-draft.md) for details about how this DID method works.
 *
 * ## Usage
 * This package is used as a plugin to the [`did-resolver`](https://github.com/decentralized-identity/did-resolver) library, which is the primary interface for resolving DIDs.
 *
 * ### Installation
 * ```
 * $ npm install pkh-did-resolver
 * ```
 *
 * ### Resolving a PKH DID
 *
 * ```js
 * import { Resolver } from 'did-resolver'
 * import { getResolver } from 'pkh-did-resolver'
 *
 * const pkhResolver = getResolver()
 * const resolver = new Resolver(pkhResolver)
 *
 * const didResolutionResult = await resolver.resolve('did:pkh:eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb')
 * ```
 *
 * Result:
 * ```js
 * {
 *   "didDocument": {
 *     "assertionMethod": [
 *       "did:pkh:eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb#blockchainAccountId",
 *     ],
 *     "authentication": [
 *       "did:pkh:eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb#blockchainAccountId",
 *     ],
 *     "id": "did:pkh:eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb",
 *     "verificationMethod": [{
 *       "blockchainAccountId": "eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb",
 *       "controller": "did:pkh:eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb",
 *       "id": "did:pkh:eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb#blockchainAccountId",
 *       "type": "EcdsaSecp256k1RecoveryMethod2020",
 *     }],
 *   },
 *   "didDocumentMetadata": {},
 *   "didResolutionMetadata": {
 *     "contentType": "application/did+json",
 *   },
 * }
 * ```
 *
 * @module pkh-did-resolver
 */

/* eslint-disable  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/require-await */
import { AccountId, ChainIdParams } from 'caip'
import type {
  DIDResolutionResult,
  DIDResolutionOptions,
  ResolverRegistry,
  ParsedDID,
  Resolver,
} from 'did-resolver'

const DID_LD_JSON = 'application/did+ld+json'
const DID_JSON = 'application/did+json'
const SECPK1_NAMESPACES = ['eip155', 'bip122']
const TZ_NAMESPACE = 'tezos'

function toDidDoc(did: string, accountId: string): any {
  const { namespace } = AccountId.parse(accountId).chainId as ChainIdParams
  const vmId = did + '#blockchainAccountId'
  const doc = {
    '@context': [
      'https://www.w3.org/ns/did/v1',
      {
        blockchainAccountId: 'https://w3id.org/security#blockchainAccountId',
        EcdsaSecp256k1RecoveryMethod2020:
          'https://identity.foundation/EcdsaSecp256k1RecoverySignature2020#EcdsaSecp256k1RecoveryMethod2020',
      },
    ],
    id: did,
    verificationMethod: [
      {
        id: vmId,
        type: 'EcdsaSecp256k1RecoveryMethod2020',
        controller: did,
        blockchainAccountId: accountId,
      },
    ],
    authentication: [vmId],
    assertionMethod: [vmId],
  }
  if (SECPK1_NAMESPACES.includes(namespace)) {
    // nothing to do here
  } else if (namespace === TZ_NAMESPACE) {
    (doc['@context'][1] as any).TezosMethod2021 = 'https://w3id.org/security#TezosMethod2021' // eslint-disable-line prettier/prettier
    const tzId = did + '#TezosMethod2021'
    doc.verificationMethod.push({
      id: tzId,
      type: 'TezosMethod2021',
      controller: did,
      blockchainAccountId: accountId,
    })
    doc.authentication.push(tzId)
    doc.assertionMethod.push(tzId)
  } else {
    throw new Error(`chain namespace not supported ${namespace}`)
  }
  return doc
}

export function getResolver(): ResolverRegistry {
  return {
    // @ts-ignore
    pkh: async (
      did: string,
      parsed: ParsedDID,
      // @ts-ignore
      r: Resolver,
      options: DIDResolutionOptions
    ): Promise<DIDResolutionResult> => {
      const contentType = options.accept || DID_JSON
      const response: DIDResolutionResult = {
        didResolutionMetadata: { contentType },
        didDocument: null,
        didDocumentMetadata: {},
      }
      try {
        const doc = toDidDoc(did, parsed.id)
        if (contentType === DID_LD_JSON) {
          response.didDocument = doc
        } else if (contentType === DID_JSON) {
          delete doc['@context']
          response.didDocument = doc
        } else {
          delete response.didResolutionMetadata.contentType
          response.didResolutionMetadata.error = 'representationNotSupported'
        }
      } catch (e) {
        response.didResolutionMetadata.error = 'invalidDid'
        // @ts-ignore
        response.didResolutionMetadata.message = e.toString()
      }
      return response
    },
  }
}
