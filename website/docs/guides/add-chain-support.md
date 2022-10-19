# Add Support for a Blockchain

The standard use of [SIWX](https://github.com/ChainAgnostic/CAIPs/pull/122), [CACAO](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-74.md) and [DID:PKH](https://github.com/w3c-ccg/did-pkh/blob/main/did-pkh-method-draft.md) allows anyone to implement support for another blockchain or account type to authenticate and authorize writes to the Ceramic Network. Additionally a few standard interfaces enables you to implement an auth and verification library that allows anyone to use it with [`did-session`](https://github.com/ceramicnetwork/js-did/tree/main/packages/did-session), the primary library to use DID based accounts with Ceramic. There is just a few steps you have to take, outlined below.

### CASA Standards Support 

First make sure your blockchain has the necessary standards specification in the [Chain Agnostic Standards Alliance (CASA)](https://github.com/ChainAgnostic/CASA). CASA creates blockchain agnostic standards which support interoperability and facilitate communication between blockchain protocols, software and companies. Standards are submitted as [Chain Agnostic Improvement Proposals (CAIPs)](https://github.com/ChainAgnostic/CAIPs). Support in Ceramic requires a spec for the following CAIPs in the CASA namespace for your chain.  

1) CAIP2 - [Blockchain ID Specification](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-2.md)

2) CAIP10 - [Account ID Specification](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-10.md)

3) CAIP122 - [Sign in With X (SIWx)](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-122.md)

The CASA namespaces can be found [here](https://github.com/ChainAgnostic/namespaces). If your blockchain already exists and has the prior 3 CAIPs, then you can move on to the next steps. If not, then you can define these specs yourself by following the instructions in the namespace readme and opening a PR. You can look at other blockchain namespaces for how to format and specify your specs and reference your own ecosystem standards for some if they exist already. You can reach out to the 3Box Labs team for reviews and help if needed. 

### DID:PKH Standards Support 

With accounts defined through CAIP10 you can now add standards support in DID:PKH for your blockchain. To add support simply add a test vector in the [did-pkh repo](https://github.com/w3c-ccg/did-pkh) that shows what a DID document resolution would look like for an example DID:PKH account for your blockchain. Reference other test vectors for examples and open a PR once ready.

### CACAO Support 

[CACAO](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-74.md) is a chain-agnostic Object Capability ([OCAP](https://en.wikipedia.org/wiki/Object-capability_model)). CACAO allows us to create DID sessions by transfering the rights to write/update specific Ceramic streams from a DID:PKH (blockchain account) to a browser session key. Session keys then can sign all Ceramic writes, needing to only sign with your blockchain account once. To add support for your blockchain we need be able to translate from SIWX messages to a CACAO (and back) and describe how to sign a SIWX. The library [`@didtools/cacao`](https://github.com/ceramicnetwork/js-did/tree/main/packages/cacao) implements this. 

To add support, first implement a SIWX class specific to your blockchain, based on the CAIP122 spec defined above. The file should be added to `src/siwx/siw(name).ts` and extend `SiwxMessage`. Typically you should only have to implement the function `signMessage()` which encodes a SIWX message in the format needed to sign message payloads in your ecosystem. Reference the Solana (SIWS) and Ethereum (SIWE) implementations for example. 

Lastly in `src/cacao.ts` implement a `fromSiw(name)Message` function for your blockchain which translates a given SIWX message to a CACAO. Again reference both SIWS and SIWE for example implementations. 

Once added, open a PR. You can reach out to the 3Box Labs team for reviews and help if needed. 

### DID-Session and Ceramic Support 

To support your blockchain account as DID:PKH in Ceramic you need to be able to both sign and verify CACAOs. Signing and verifying is often specific to a chain depending on the ecosystem wallets, cryptography used and ecosystem standards. Each blockchain adds support by implementing an AuthMethod and Verifier in a blockchain specific library in the [`js-did` monorepo](https://github.com/ceramicnetwork/js-did). Reference existing chains, both Solana and Ethereum for example.

Authmethods are the primary interface used by [`did-session`](https://github.com/ceramicnetwork/js-did/tree/main/packages/did-session). It has the following interface: 

```tsx
type AuthMethod = (opts: AuthMethodOpts) => Promise<Cacao>
```

Typicaly you will write a function or class that returns a configured AuthMethod and provides any specific helper functions that help a developer use your blockchain with an AuthMethod.

Verifiers are used by Ceramic nodes to verify signed commits by a DID:PKH and CACAO. Nodes must register the verifiers needed for the blockchains and accounts they want to support. Right now most are included by default, once implemented. Verifers have the following interface. 

```tsx
export type Verifiers = Record<string, CacaoVerifier>

export type CacaoVerifier = (cacao: Cacao, opts: VerifyOptions) => Promise<void>
```

To add support you create a `@didtools/pkh-(namespace)` package in the [`js-did` monorepo](https://github.com/ceramicnetwork/js-did). Use the existing `@didtools/pkh-ethereum` and `@didtools/pkh-solana` libraries as a template to implement similar naming, functionality, documentation and testing. But primarly the library should export a `Verifier` and a function or class the gives the developer a configured `AuthMethod`. Once ready open a PR. You can reach out to the 3Box Labs team for reviews and help if needed. 

### Ready, Set, Go

Once your library and PR are accepted, we will release them for everyone to use and add verifier support for them in Ceramic. We aim to have each maintained by their respective ecosystems when possible, as we dont have the knowledge of all details and specifications in each ecosystem to best support each and every one. If they fall out of date, or tests begin to fail, we may not be able to maintain them ourselves. 

Congrats, now everyone can auth and write to Ceramic directly with their blockchain account of your choice.
