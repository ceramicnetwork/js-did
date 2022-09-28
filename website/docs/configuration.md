# Configuration

When creating a DID session, you need to pass an array of string identifiers for resources you want to authorize
for. These identifiers should be specific to the verification protocol you use, for example, for Ceramic Network Protocol,
they are ceramic stream IDs.

```ts
const session = await DIDSession.authorize(authMethod, { resources: [...]})
```

By default a session will expire in 1 day. You can change this time by passing the `expiresInSecs` option to
indicate how many seconds from the current time you want this session to expire.

```ts
const oneWeek = 60 * 60 * 24 * 7
const session = await DIDSession.authorize(authMethod, { resources: [...], expiresInSecs: oneWeek })
```

A domain/app name is used when making requests, by default in a browser based environment the library will use
the domain name of your app. If you are using the library in a non web based environment you will need to pass
the `domain` option otherwise an error will thrown.

```ts
const session = await DIDSession.authorize(authMethod, { resources: [...], domain: 'YourAppName' })
```

Additional helper functions are available to help you manage a session lifecycle and the user experience.

```ts
// Check if authorized or created from existing session string
didsession.hasSession

// Check if session expired
didsession.isExpired

// Get resources session is authorized for
didsession.authorizations

// Check number of seconds till expiration, may want to re auth user at a time before expiration
didsession.expiresInSecs
```

