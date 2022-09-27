# Storing Sessions

You can serialize a session to store for later and then re-initialize. Currently sessions are valid
for 1 day by default.

```ts
// Create session as above, store for later
const session = await DIDSession.authorize(authMethod, { resources: [...]})
const sessionString = session.serialize()

// write/save session string where you want (ie localstorage)
// ...

// Later re initialize session
const session2 = await DIDSession.fromSession(sessionString)
```