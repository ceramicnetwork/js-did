# Upgrading from `@glazed/did-session` to `did-session`

`authorize` changes to a static method which returns a did-session instance and `getDID()` becomes a `did` getter. For example:

```ts
// Before @glazed/did-session
const session = new DIDSession({ authProvider })
const did = await session.authorize()

// Now did-session
const session = await DIDSession.authorize(authProvider, { resources: [...]})
const did = session.did
```

Requesting resources are required now when authorizing, before wildcard (access all) was the default. You can continue to use
wildcard by passing the following * below. Wildcard is typically only used with `@glazed` libraries and/or tile documents and
it is best to switch over when possible, as the wildcard option may be * deprecated in the future. When using with
composites/models you should request the minimum needed resources instead.

```ts
const session = await DIDSession.authorize(authProvider, { resources: [`ceramic://*`]})
const did = session.did
```
