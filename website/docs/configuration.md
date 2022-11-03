# Configuration

When creating a DID session, you need to pass an array of string identifiers for resources you want to authorize
for. In the context of the Ceramic Network, resources are an array of Model Stream Ids or Streams Ids. Typically
you will just pass resources from the `@composedb` libraries as you will already manage your Composites and Models 
there. For example:

```js
import { ComposeClient } from '@composedb/client'

//... Reference above and `@composedb` docs for additional configuration here

const client = new ComposeClient({ceramic, definition})
const resources = client.resources
const session = await DIDSession.authorize(authMethod, { resources })
client.setDID(session.did)
```

If you are still using `@glazed` libraries and tile document streams you will typically pass a wildcard resource, 
this all allows 'access all'. While not ideal, there is technical limits in `@glazed` libraries and tile document
streams that make it difficult to offer more granular permission access to sets of stream. Authorization was mostly 
designed with model document streams and `@composedb` libraries in mind. Wildcard resource may not be supported in
the future.

```js
const session = await DIDSession.authorize(authMethod, { resources: [`ceramic://*`]})
```

By default a session will expire in 1 day. You can change this time by passing the `expiresInSecs` option to
indicate how many seconds from the current time you want this session to expire.

```js
const oneWeek = 60 * 60 * 24 * 7
const session = await DIDSession.authorize(authMethod, { resources: [...], expiresInSecs: oneWeek })
```
