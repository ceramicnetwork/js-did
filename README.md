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

| Name                                                              | Description                                                                                               | Version                                                                      |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [`dids`](./packages/dids)                                         | [Interact with DIDs](https://developers.ceramic.network/reference/core-clients/did-jsonrpc/)                         | ![npm version](https://img.shields.io/npm/v/dids.svg)                        |
| [`did-session`](./packages/datamodel)                             | [Manages user DID in web based environments](https://developers.ceramic.network/reference/accounts/did-session/)   | ![npm version](https://img.shields.io/npm/v/did-session.svg)                 |

## License

Dual licensed under [MIT](LICENSE-MIT) and [Apache 2](LICENSE-APACHE)