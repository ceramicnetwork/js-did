## v2.4.0 (2021-07-12)

feat: Pass explicit issuer to verifyJWS function

## v2.3.0 (2021-07-08)

feat: Flag for disabled time-check of a signature
feat: Make sure key is not used before it is available in DID document

## v2.2.1 (2021-07-02)

feat: Use implicit notion of _now_, instead of explicit `new Date`

## v2.2.0 (2021-06-23)

feat: Handle key revocation when checking a signature 

## v2.1.0 (2021-04-20)

feat: Update DIDProvider and related types

## v2.0.1 (2021-05-08)

chore: Update dependencies

## v2.0.0 (2021-03-10)

feat: Upgrade to did-resolver v3

## v1.1.1 (2020-12-17)

fix: proper detection of did-resolver class (#21)

## v1.1.0 (2020-11-26)

feat: return payload in verifyJWS method

## v1.0.0 (2020-11-25)

This release aligns this implementation with EIP2844.

## v0.6.1 (2020-09-22)

fix: add padding to encrypted cleartext

## v0.6.0 (2020-09-22)

feat: add support for encryption

## v0.5.0 (2020-08-24)

feat: add createDagJWE api

## v0.4.0 (2020-08-21)

Changed `DID` property to `id`

## v0.3.0 (2020-08-21)

Added `createDagJWS` method

## v0.2.0 (2020-08-19)

- Changed constructor argument to `DIDOptions` interface
- Added `setProvider` method
- Added `setResolver` method
- Added `resolve` method

## v0.1.0 (2020-08-05)

First release
