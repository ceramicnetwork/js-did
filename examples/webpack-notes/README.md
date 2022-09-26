# Notes demo app

## Setup

1. Install dependencies using `pnpm install`
1. Start a local Ceramic node using `pnpm run ceramic`
1. Deploy the composite models to your Ceramic node with `pnpm run composite:compile`
1. Configure your local Ceramic node to index the following models:
   - `kjzl6hvfrbw6c9ybqwsouk360g9xpa9242yywdoz01cgprao3e97g1hrn3krxxn`
   - `kjzl6hvfrbw6cb1d0zxu1njiaz4rcf0hxln322zuuavwyua9l1oe4c4xzvjmk3r`
1. Restart the local Ceramic node with the updated configuration

## Scripts

In the project directory, you can run:

### `pnpm start`

Runs the app in the development mode.
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

### `pnpm run build`

Builds the app for production to the `build` folder.

### `pnpm run composite:compile`

Runs the `compile-composite.mjs` script, ensuring the models defined in the composite are deployed to the local Ceramic node and the runtime definition is generated for the app.

### `pnpm run composite:serve`

Runs the `start-server.mjs` script to start a local GraphQL server to interact with the composite models.
A hex-encoded 32-byte `SEED` environment variable can be provided to authenticate a DID on the Ceramic instance, allowing mutations.

### `pnpm run composite:create`

Runs the `create-composite.mjs` script to create a composite from the source schema.
This is only needed to make changes to the composite used by the app, and requires updating the Ceramic config accordingly.
A hex-encoded 32-byte `SEED` environment variable must be present to create a key DID for the models when running the script.

## License

Apache-2.0 OR MIT
