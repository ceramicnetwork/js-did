# Interface: VerifyJWSOptions

[dids/src](../modules/dids_src.md).VerifyJWSOptions

## Properties

### atTime

• `Optional` **atTime**: `Date`

JS timestamp when the signature was allegedly made. `undefined` means _now_.

___

### capability

• `Optional` **capability**: `Cacao`

Cacao OCAP to verify the JWS with.

___

### disableTimecheck

• `Optional` **disableTimecheck**: `boolean`

If true, timestamp checking is disabled.

___

### issuer

• `Optional` **issuer**: `string`

DID that issued the signature.

___

### revocationPhaseOutSecs

• `Optional` **revocationPhaseOutSecs**: `number`

Number of seconds that a revoked key stays valid for after it was revoked
