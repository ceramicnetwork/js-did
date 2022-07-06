# DIDs monorepo

Packages to interact with and manage DIDs. 

## Installation

This monorepo uses Yarn workspaces, make sure to install it first if you don't already have it.

1. `yarn install` to install the dependencies
1. `yarn build` to build all the packages

### Additional scripts

- `yarn lint` to run the linter in all packages
- `yarn test` to run tests in all packages
- `yarn docs` to generate API documentation

## Packages

| Name                                                              | Description                                                                                               | Version                                                                      |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [`dids`](./packages/dids)                                         | [Interact with DIDs](https://developers.ceramic.network/tools/glaze/tile-loader/)                         | ![npm version](https://img.shields.io/npm/v/dids.svg)                        |
| [`did-session`](./packages/datamodel)                             | [Manages user DID in web based environments](https://developers.ceramic.network/tools/glaze/datamodel/)   | ![npm version](https://img.shields.io/npm/v/did-session.svg)                 |

## License

Dual licensed under [MIT](LICENSE-MIT) and [Apache 2](LICENSE-APACHE)