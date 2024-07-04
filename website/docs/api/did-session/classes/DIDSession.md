# Class: DIDSession

DID Session

```sh
import { DIDSession } from 'did-session'
```

## Constructors

### new DIDSession()

> **new DIDSession**(`params`): [`DIDSession`](DIDSession.md)

#### Parameters

• **params**: [`SessionParams`](../index.md#sessionparams)

#### Returns

[`DIDSession`](DIDSession.md)

## Accessors

### authorizations

> `get` **authorizations**(): `string`[]

Get the list of resources a session is authorized for

#### Returns

`string`[]

***

### cacao

> `get` **cacao**(): `Cacao`

Get the session CACAO

#### Returns

`Cacao`

***

### did

> `get` **did**(): `DID`

Get DID instance, if authorized

#### Returns

`DID`

***

### expireInSecs

> `get` **expireInSecs**(): `number`

Number of seconds until a session expires

#### Returns

`number`

***

### hasSession

> `get` **hasSession**(): `boolean`

#### Returns

`boolean`

***

### id

> `get` **id**(): `string`

DID string associated to the session instance. session.id == session.getDID().parent

#### Returns

`string`

***

### isExpired

> `get` **isExpired**(): `boolean`

Determine if a session is expired or not

#### Returns

`boolean`

## Methods

### isAuthorized()

> **isAuthorized**(`resources`?): `boolean`

Determine if session is available and optionally if authorized for given resources

#### Parameters

• **resources?**: `string`[]

#### Returns

`boolean`

***

### serialize()

> **serialize**(): `string`

Serialize session into string, can store and initalize the same session again while valid

#### Returns

`string`

***

### authorize()

> `static` **authorize**(`authMethod`, `authOpts`): `Promise`\<[`DIDSession`](DIDSession.md)\>

Request authorization for session

#### Parameters

• **authMethod**: `AuthMethod`

• **authOpts**: `AuthOpts` = `{}`

#### Returns

`Promise`\<[`DIDSession`](DIDSession.md)\>

***

### fromSession()

> `static` **fromSession**(`session`): `Promise`\<[`DIDSession`](DIDSession.md)\>

Initialize a session from a serialized session string

#### Parameters

• **session**: `string`

#### Returns

`Promise`\<[`DIDSession`](DIDSession.md)\>

***

### get()

> `static` **get**(`account`, `authMethod`, `authOpts`): `Promise`\<[`DIDSession`](DIDSession.md)\>

Get a session for the given accountId, if one exists, otherwise creates a new one.

#### Parameters

• **account**: `AccountId`

• **authMethod**: `AuthMethod`

• **authOpts**: `AuthOpts` = `{}`

#### Returns

`Promise`\<[`DIDSession`](DIDSession.md)\>

***

### hasSessionFor()

> `static` **hasSessionFor**(`account`, `resources`): `Promise`\<`boolean`\>

Check if there is an active session for a given account.

#### Parameters

• **account**: `AccountId`

• **resources**: `string`[]

#### Returns

`Promise`\<`boolean`\>

***

### initDID()

> `static` **initDID**(`didKey`, `cacao`): `Promise`\<`DID`\>

#### Parameters

• **didKey**: `DID`

• **cacao**: `Cacao`

#### Returns

`Promise`\<`DID`\>

***

### remove()

> `static` **remove**(`account`): `Promise`\<`void`\>

Removes a session from storage for a given account (if created using `DIDSession.get`)

#### Parameters

• **account**: `AccountId`

#### Returns

`Promise`\<`void`\>
