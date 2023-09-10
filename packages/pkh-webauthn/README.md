## Webauthn AuthMethod and Verifier

Implements support to authenticate, authorize and verify blocks produced
by webauthn/passkey compatible hardware authenticators and OS/software implementations.

## Installation

```
npm install --save @didtools/pkh-webauthn
```

## Auth Usage

This module is designed to run in browser environments.

Create a Credential for first time users:
```js
import { createCredential, simpleCreateOpts } from '@didtools/pkh-webauthn'

const wns = WebauthnAuth.createSession()
const { credentialId, publicKey, did } = await WebauthnAuth.createCredential(wsn, simpleCreateOpts('richard@app'))
console.log('Credential created:', credentialId, publicKey, did)
```

Initialize instance of Webauthn auth provider

```js
import { WebauthnAuth, probeAuthenticator } from '@didtools/pkh-webauthn'

// Initialize a new webauthn session using
const wns = WebauthnAuth.createSession({
    async select (credentialId, pk0, pk1) {
        // Recover publicKey with help of user-interaction (see caveat below)
        alert('New device detected! Authenticator says "Hello"')
        return await probeAuthenticator(pk0, pk1)
    }
})

const authMethod = await WebauthnAuth.getAuthMethod(wns)

// Proceed as normal
const session = await DIDSession.authorize(authMethod, { resources: ['ceramic://nil'] })
```

## Verifier Usage

Verifiers are needed to verify different did:pkh signed payloads using CACAO. Libraries that need them will
consume a verifiers map allowing your to register the verifiers you want to support. 

```js
import { Cacao } from '@didtools/cacao'
import { WebauthnAuth } from '@didtools/pkh-webauthn'
import { DID } from 'dids'

const verifiers = {
	...WebauthnAuth.getVerifier()
}

// Directly with cacao
Cacao.verify(cacao, { verifiers, ...opts})

// With DIDS, reference DIDS for more details
const dids = // configured dids instance
await dids.verifyJWS(jws, { capability, verifiers, ...opts})
```

## Caveat - KeySelector

The webauthn+fido2 standard was originally designed for use with central databases and at that time
a pesudo random `CredentialID` was preferred over the use of public keys.  
And thus when generating a secret on secure hardware, then the public key is only ever exported once
on `createCredential(opts)` and expected to be stored in a KV-store `CredentialID => PublicKey` for later lookup.  

However we can use the authenticators in a decentral manner by recovering the public key given two signed messages from the same credential.

Here are two `KeySelector` examples:

```js
// Using a service
const selector = {
    async seen (credentialId, publicKey) {
        await fetch(`https://name.me/register/${credentialId}`, {
            method: 'POST',
            body: { publicKey }
        })
    },

    async select (credentialId) {
        const res = await fetch(`https://name.me/whois/${credentialId}`)
        const { publicKey } = await res.json()
        return publicKey
    }
}

const wns = WebauthnAuth.createSession(selector)
```

Or using the `probeAuthenticator` helper:
```js
// recovery through probing
import { probeAuthenticator } from '@didtools/pkh-webauthn'

const selector = {
    async select (_, pk0, pk1) {
        return await probeAuthenticator(pk0, pk1)
    }
}

const wns = WebauthnAuth.createSession(selector)
```

### KeySelector Interface

```ts
import { WebauthnAuth } from '@didtools/pkh-webauthn'

// WebauthnAuth.KeySelector
export interface KeySelector {

    // Invoked when a new credential/publicKey is detected.
    seen: (credentialId: string, pk: Uint8Array) => void

    // Invoked during Cacao signing process in the scenario that
    // user has plugged their authenticator into a new device.
    // The return value must be either pk0 or pk1 - otherwise the operation fails.
    select: (credentialId: string, pk0: Uint8Array, pk1: Uint8Array) => Uint8Array|null
}
```

## License

Apache-2.0 OR MIT
