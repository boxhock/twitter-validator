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

## Development

#### Overview

This is monorepo with two separate packages included: `external-adapter` and
`external-initiator`.

#### Install dependencies

```shell script
yarn install
```

#### Run tests

```shell script
yarn test
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
