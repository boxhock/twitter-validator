# Chainlink External Adapter and External Initiator for twitter validation

## Why it exists

This repository consists
[External Adapter](https://docs.chain.link/docs/external-adapters) and
[External Initiator](https://docs.chain.link/docs/initiators#external) for
[Chainlink](https://chain.link) Node which supports validation of user twitter
account on Ethereum blockchain using .crypto domains.

## Architecture overview

### Validation flow diagram

![Twitter Validation Flow](./documentation/diagrams/twitter-validation-flow.png)

## Production

All packages prodives Dockerfile. You need to build docker image before running
the module.

### Build docker image

Run from repository root.

```shell script
docker build -f <package name>/Dockerfile . -t <image name>
```

### Run

You would need set all required environment variables for running docker image.

#### Env variables

All environment variables that needed by docker image specified at
`<package name>/README.md`

#### Run docker image

```shell script
docker run -p 3000:3000 -e PORT=3000 -e FIRST_ENV=value -e SECOND_ENV=val <image name>
```

Note: port can be different depends on `PORT` environment variable value.

### API documentation
Find api docs here: `<package name>/API.md`

### Chainlink Node configuration

[Job Specification Example](./documentation/chainlink/JobSpecExample.json)

## Development

#### Overview

This is monorepo with two separate packages included: `external-adapter` and
`external-initiator`.

#### Install dependencies

```shell script
yarn install
```

#### Run linters (prettier and eslint incuded)

```shell script
yarn lint
```

#### Run automatic fixes for prettier and eslint errors

```shell script
yarn fix
```

#### Node.js version required

`~12`

## Important points

- [How Chainlink works](https://www.kaleido.io/blockchain-blog/how-chainlink-works-under-the-covers)
- [How External Initiator works](https://medium.com/secure-data-links/chainlink-external-initiators-e8c49ff885b3)
- [How External Adapter works](https://medium.com/chainlink/chainlink-external-adapters-e9f99cd6cb62)
