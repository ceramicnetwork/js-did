## Webauthn AuthMethod and Verifier

Implements support to authenticate, authorize and verify blocks produced
by webauthn/passkey compatible hardware authenticators and OS/software implementations.

## Installation

```
npm install --save @didtools/key-webauthn
```

## Auth Usage

This module is designed to run in browser environments.

Create a Credential for first time use:
```js
import { WebauthnAuth } from '@didtools/key-webauthn'

const did = await WebauthnAuth.createDid('app-user')

const authMethod = await WebauthnAuth.getAuthMethod({ did })
const session = await DIDSession.authorize(authMethod, { resources: ['ceramic://nil'] })
```

## Verifier Usage

Verifiers are needed to verify different did:pkh signed payloads using CACAO. Libraries that need them will
consume a verifiers map allowing your to register the verifiers you want to support. 

```js
import { Cacao } from '@didtools/cacao'
import { WebauthnAuth } from '@didtools/key-webauthn'
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

## Caveat: DID selection

The webauthn+fido2 standard was originally developed for use with databases and at that time
a pesudo random `CredentialID` was preferred over the use of public keys.  

The public key is exported only **once** when the credential is created - spec limitation.
There are 3 options for `getAuthMethod()`

#### Option 1. Known DID

```js
import { WebauthnAuth } from '@didtools/key-webauthn'

const authMethod = WebauthnAuth.getAuthMethod({ did: 'did:key:zDn...' })
```

#### Option 2. Probe

Probe the authenticator for public keys by asking user to sign a nonce:

```js
import { WebauthnAuth } from '@didtools/key-webauthn'

const dids = await WebauthnAuth.probeDIDs()
const authMethod = WebauthnAuth.getAuthMethod({ dids })
```

#### Option 3. Callback

Use a callback with the following call signature:

```ts
(did1: string, did2: string) => Promise<string>
```

Example that probes on-demand:
```js
import { WebauthnAuth } from '@didtools/key-webauthn'

const selectDIDs = async (did1, did2) {
    const dids = await WebauthnAuth.probeDIDs()
    if (dids.includes(did1)) return did1
    else return did2
}

const authMethod = WebauthnAuth.getAuthMethod({ selectDIDs })
```

## Compatibility

Tests done via [demo](https://didtoolswn.surge.sh/).

| Browser       | Version | OS             | Device  | Authenticator      | Works | Remark  |
|---------------|---------|----------------|---------|--------------------|-------|---------|
| Chrome        | 107     | Mac OS 10.15.7 | Desktop | Yubikey v5 (USB-C) | ✅    |         |
| Safari        | 15.6    | Mac OS 10.15.7 | Desktop | Yubikey v5 (USB-C) | ✅    |         |
| Safari        | 15.6    | Mac OS 10.15.7 | Desktop | OS-Authenticator   | ✅    |         |
| Brave         | 119     | Mac OS 10.15.7 | Desktop | 1password          | ✅    |         |
| Mobile Safari | 16.6    | iOS 16.6       | Mobile  | Yubikey v5 (USB-C) | ✅    |         |
| Mobile Safari | 16.6    | iOS 16.6       | Mobile  | OS-Authenticator   | ✅    |         |
| Chrome        | 122     | Windows 10     | Desktop | Yubikey v5         | ✅    |         |
| Chrome        | 122     | Windows 10     | Desktop | GPM+Android device | ❌    | Timeout |
| Firefox       | 84      | Windows 10     | Desktop | Yubikey v5         | ❌    | e1      |
| Firefox       | 120     | Windows 10     | Desktop | Yubikey v5         | ✅    |         |
| Chrome        | 116     | Linux          | Desktop | Yubikey v5         | ✅    |         |
| Firefox       | 115     | Linux          | Desktop | Yubikey v5         | ✅    |         |
| Chrome        | 120     | Android 10     | Mobile  | Yubikey v5         | ✅    | e2      |
| Chrome        | 120     | Android 10     | Mobile  | OS-Authenticator   | ✅    |         |
| Firefox       | 114     | Android 10     | Mobile  | Yubikey v5         | ✅    | e2      |
| Firefox       | 114     | Android 10     | Mobile  | OS-Authenticator   | ✅    |         |

`e1` - An attempt was made to use an object that is not, or is no longer available  
`e2` - OTG cable was used, when attempting NFC an error message was shown urging USB connection.  


## License

Apache-2.0 OR MIT
