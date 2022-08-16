# Configuration

By default a session will expire in 1 day. You can change this time by passing the `expiresInSecs` option to
indicate how many seconds from the current time you want this session to expire.

```ts
const oneWeek = 60 * 60 * 24 * 7
const session = await DIDSession.authorize(authProvider, { resources: [...], expiresInSecs: oneWeek })
```

A domain/app name is used when making requests, by default in a browser based environment the library will use
the domain name of your app. If you are using the library in a non web based environment you will need to pass
the `domain` option otherwise an error will thrown.

```ts
const session = await DIDSession.authorize(authProvider, { resources: [...], domain: 'YourAppName' })
```
