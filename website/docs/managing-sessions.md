# Managing Sessions

You can serialize a session to store for later and then re-initialize. Currently sessions are valid
for 1 day by default.

```js
// Create session as above, store for later
const session = await DIDSession.authorize(authMethod, { resources: [...]})
const sessionString = session.serialize()

// write/save session string where you want (ie localstorage)
// ...

// Later re initialize session
const session2 = await DIDSession.fromSession(sessionString)
```

Additional helper functions are available to help you manage a session lifecycle and the user experience.

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
