# Development
> Getting started with development on js-did

## Project setup
First clone the repo:
```
$ git clone https://github.com/ceramicnetwork/js-did.git
$ cd js-did
```

This monorepo uses pnpm, make sure to install it first if you don't already have it.
```
$ npm install -g pnpm
```

To install dependencies for all packages in this repo:
```
$ pnpm install
```

Then build all packages:
```
$ pnpm run build
```

## Run tests
You can run all tests at the top level,
```
$ pnpm test
```
If you only want to test a specific package just `cd` into the specific package folder and run the same command as above.

## Creating a release
This repo uses pnpm to make releases, each package is released and versioned individually. [Semantic versioning](https://semver.org/) is followed to version releases. We do not currently regularly make releases on schedule or make release candidates (alpha/beta). Releases are made when changes are available to release. Released packages are published to NPM.

Before creating any releases, make sure you have an npm account (you can sign up at https://www.npmjs.com/), have signed into that account on the command line with `npm adduser`, and that the account has been added to the @ceramicnetwork org on npm.

### Release

Releases are currently done manually and not by any CI. CI will only publish documentation on release. Process may be further formalized in the future. To make a release:

1) First create a release branch 
```
git checkout -b release/any-name
```
2) Version and update the package.json for every package you want to release. Update the workspace versions in each package.json for corresponding packages to be released. Run:
```
pnpm install
```
3) Create release commit, include each package and version to be released, for example: 
```
git commit -m 'pkh-solana@0.0.3, did-session@1.0.0' 
```
4) Push and open PR, request review and make sure all github checks pass before merging. 
5) Once merged, pull main branch locally, make sure it is up to date and all latest dependencies are installed.
```
git checkout main
git pull 
pnpm install
```
6) Now publish each package you want to release, cd into package folder and publish. Repeat for each package. The publish command will build the package and run some checks before publishing to NPM. 
```
cd package-name
pnpm publish
```