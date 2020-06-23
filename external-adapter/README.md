# Chainlink External Adapter

## Development

#### Install dependencies

```shell script
yarn install
```

#### Run development server

```shell script
yarn dev
```

#### Run tests

```shell script
yarn test
```

## Production

#### Build for production

```shell script
yarn build
```

#### Run production server

```shell script
node `dist/index.js`
```

## Environment variables reference

#### The following environment variables need to be set:

| Name                    | Description                                                                                                                                                      | Required             |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `TWITTER_API_KEY`       | Twitter developer application api key. [Twitter documentation](About twhttps://developer.twitter.com/en/docs/basics/apps/guides/the-app-management-dashboard)    | `Yes`                |
| `TWITTER_API_SECRET`    | Twitter developer application api secret. [Twitter documentation](About twhttps://developer.twitter.com/en/docs/basics/apps/guides/the-app-management-dashboard) | `Yes`                |
| `VALIDATOR_PRIVATE_KEY` | Ethereum private key of the validator. All validator signatures will be created using this private key.                                                          | `Yes`                |
| `PORT`                  | Port for handling incoming HTTP requests                                                                                                                         | `No` `Default: 3000` |

[Test environment varibles example](./test.env)
