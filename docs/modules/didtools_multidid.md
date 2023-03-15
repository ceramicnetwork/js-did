# Module: @didtools/multidid

# Multidid
Multidid is a representation strategy for DIDs and DID URLs that is very compact and extensible. It allows any DID method to be represented as a 
string of bytes. Reference [specification](https://github.com/ChainAgnostic/multidid).

This library is a multidid utility library to encode and decode multidids to their byte and string representation and convert from did strings to multidid representations. 

## Installation

```
npm install --save @didtools/multidid
```

## Usage

```js
import { Multidid } from '@didtools/multidid'

const didString = "did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp#z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp"

// Multidid instance from did string
const multidid = Multidid.fromDIDString(didString)

// Encode to bytes
multidid.encode() 

// Decode from bytes to multidid instance
Multidid.decode(bytes)

// Encode as base16 string 
const mdStr = multidid.toString('base16')
console.log(mdStr)
// f9d1aed013b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29307a364d6b6954427a31796d75657041513448454859534631483871754735474c5656515233646a6458336d446f6f5770

// Multidid instance from base encoded string 
Multidid.fromString(mdStr)

// DID string from multidid
multidid.toDidString()

```

## Classes

- [Multidid](../classes/didtools_multidid.Multidid.md)
