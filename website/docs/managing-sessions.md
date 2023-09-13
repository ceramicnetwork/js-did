# Managing Sessions

A session can be managed in a few different ways. All sessions consist of a session key in the form of a `did:key` and a CACAO object-capability.

## Automatically persisted sessions

By default (when using `DIDSession.get(...)`) sessions are persisted to [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) in the background. The private key for this session is always a [non-extractable](https://developer.mozilla.org/en-US/docs/Web/API/CryptoKey/extractable) key, which means that they key itself can't be stolen by a malicious browser extension or script.

You can check if there already exists an authorized session for any given account using the `hasSessionFor` method. This can be useful if you want to know if the `DIDSession.get` call with result in a wallet interaction from the user, which will happen if `hasSessionFor` returns `false`.

```js
if (await DIDSession.hasSessionFor(accountId, resources: [...])) {
  console.log(`There is an active session for ${accountId}`)
}
```


## Session lifecycle management

Additional helper functions are available on DIDSession instances to help you manage a session lifecycle and the user experience.

```js
// Check if authorized or created from existing session string
didsession.hasSession

// Check if session expired
didsession.isExpired

// Get resources session is authorized for
didsession.authorizations

// Check number of seconds till expiration, may want to re auth user at a time before expiration
didsession.expiresInSecs
```


## Manual session management

If you don't want to rely on browsers non-extractable keys, or you are not in a browser environment you can use the `DIDSession.authorize(...)` function. This function creates a session that can be serialized to a string. You can store this for later and then re-initialize. Currently sessions are valid
for 1 week by default.

```js
// Create session as above, store for later
const session = await DIDSession.authorize(authMethod, { resources: [...]})
const sessionString = session.serialize()

// write/save session string where you want (e.g. filesystem)
// ...

// Later re initialize session
const session2 = await DIDSession.fromSession(sessionString)
```