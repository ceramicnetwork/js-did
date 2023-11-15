# DIDs monorepo

Packages to interact with and manage DIDs. 

## Installation

This monorepo uses [pnpm](https://pnpm.io/), make sure to install it first if you don't already have it.

1. `pnpm install` to install the dependencies
1. `pnpm run build` to build all the packages

### Additional scripts

- `pnpm run lint` to run the linter in all packages
- `pnpm run test` to run tests in all packages
- `pnpm run docs` to generate API documentation

## Packages

| Name                                            | Description                                                                                               | Version                                                                      |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [`dids`](./packages/dids)                       | [Interact with DIDs](https://developers.ceramic.network/docs/dids/guides/using-with-composedb-client)                         | ![npm version](https://img.shields.io/npm/v/dids.svg)             |
| [`did-session`](./packages/did-session)         | [Manages user DID in web based environments](https://did.js.org/docs/api/modules/did_session)   | ![npm version](https://img.shields.io/npm/v/did-session.svg)        |
| [`@didtools/cacao`](./packages/cacao)           | Chain-Agnostic Object Capabilities                     | ![npm version](https://img.shields.io/npm/v/@didtools/cacao.svg)         |
| [`@didtools/pkh-ethereum`](./packages/pkh-ethereum) | DID PKH Ethereum                                   | ![npm version](https://img.shields.io/npm/v/@didtools/pkh-ethereum.svg)  |
| [`@didtools/pkh-solana`](./packages/pkh-solana)     | DID PKH Solana                                     | ![npm version](https://img.shields.io/npm/v/@didtools/pkh-solana.svg)    |
| [`@didtools/pkh-tezos`](./packages/pkh-tezos)       | DID PKH Tezos                                      | ![npm version](https://img.shields.io/npm/v/@didtools/pkh-tezos.svg)     |
| [`key-did-resolver`](./packages/key-did-resolver)   | DID Key Resolver                                   | ![npm version](https://img.shields.io/npm/v/key-did-resolver.svg)        |
| [`pkh-did-resolver`](./packages/pkh-did-resolver)   | DID PKH Resolver                                   | ![npm version](https://img.shields.io/npm/v/pkh-did-resolver.svg)        |



## Releasing & Contributing

We are happy to accept small and large contributions, feel free to make a suggestion or submit a pull request.

Check out the [Development](./DEVELOPMENT.md) section to learn more and for the current release process. 


## License

Dual licensed under [MIT](LICENSE-MIT) and [Apache 2](LICENSE-APACHE)
