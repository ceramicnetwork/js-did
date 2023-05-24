# Development

> Getting started with development on js-did

## Project setup

First clone the repo:

```
git clone https://github.com/ceramicnetwork/js-did.git
cd js-did
```

This monorepo uses pnpm, make sure to install it first if you don't already have it.

```
npm install -g pnpm
```

To install dependencies for all packages in this repo:

```
pnpm install
```

Then build all packages:

```
pnpm run build
```

## Run tests

You can run all tests at the top level,

```
pnpm test
```

If you only want to test a specific package just `cd` into the specific package folder and run the same command as above.

## Documenting changes

js-did uses [changesets](https://github.com/changesets/changesets) to keep track of and release changes.

To generate a new changeset, run `pnpm changeset` in the root of the repository and follow the instructions.
The generated markdown files in the `.changeset` directory should be committed to the repository.

## Creating a release

This repo uses pnpm to make releases, each package is released and versioned individually. [Semantic versioning](https://semver.org/) is followed to version releases. We do not currently regularly make releases on schedule or make release candidates (alpha/beta). Releases are made when changes are available to release. Released packages are published to NPM.

Before creating any releases, make sure you have an npm account (you can sign up at https://www.npmjs.com/), have signed into that account on the command line with `npm adduser`, and that the account has been added to the @ceramicnetwork org on npm.

### Release

Releases are currently done manually and not by any CI. CI will only publish documentation on release. Process may be further formalized in the future. To make a release:

1. First create a release branch from the lastest main branch.

```
git checkout -b release/any-name
```

2. Run `pnpm changeset version`. This will bump the versions of the packages previously specified with pnpm changeset (and any dependents of those) and update the changelog files.

3. Run `pnpm install`. This will update the lockfile and rebuild packages.

4. Create release commit, include each package and version to be released, for example:

```
git commit -m 'pkh-solana@0.0.3, did-session@1.0.0'
```

5. Push and open PR, request review and make sure all github checks pass before merging.

6. Once merged, pull main branch locally, make sure it is up to date and all latest dependencies from the lock file are installed.

```
git checkout main
git pull
pnpm install --frozen-lockfile
```

7. Run `pnpm publish -r` to publish all the updated and newly created packages. The publish command will build the packages and run some checks before publishing to NPM.
