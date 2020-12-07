## Getting started

Install the dependencies. This will install both front-end (Svelte) and server (Express) dependencies.

```bash
npm install
```

## Running the front-end

This is example is based on [Svelte](https://svelte.dev) and [Svelte/template](https://github.com/sveltejs/template). More information about Svelte can be found in their respective repositories and documentation.

Start the server by running the following command. This will spin up a localhost server runnning on port 5000.

```bash
npm run dev
```

To create an optimised version of the app:

```bash
npm run build
```

## Running the server

To access the ILP endpoints you need to run the express server. This wil start the server on port 5100.

```bash
node server.js
```

## Using the example

Type in your RippleX account name and authorization token (will not be stored anywere) and click donate.
