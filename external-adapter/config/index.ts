import {
  bufferToHex,
  privateToPublic,
  publicToAddress,
  toBuffer,
  toChecksumAddress,
} from 'ethereumjs-util';

const config = {
  TWITTER: {
    API_URL: 'https://api.twitter.com',
    API_VERSION: '1.1',
    API_KEY: process.env.TWITTER_API_KEY as string,
    API_SECRET: process.env.TWITTER_API_SECRET as string,
  },
  VALIDATOR_PRIVATE_KEY: process.env.VALIDATOR_PRIVATE_KEY as string,
  VALIDATOR_PUBLIC_KEY: '',
  VALIDATOR_ETHEREUM_ADDRESS: '',
  PORT: Number(process.env.PORT || 3000),
};

const publicKey = privateToPublic(toBuffer(config.VALIDATOR_PRIVATE_KEY));
config.VALIDATOR_PUBLIC_KEY = bufferToHex(publicKey);
config.VALIDATOR_ETHEREUM_ADDRESS = toChecksumAddress(
  bufferToHex(publicToAddress(publicKey)),
);

export default config;
