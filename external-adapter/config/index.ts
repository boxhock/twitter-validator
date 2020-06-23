const config = {
  TWITTER: {
    API_URL: 'https://api.twitter.com',
    API_VERSION: '1.1',
    API_KEY: process.env.TWITTER_API_KEY as string,
    API_SECRET: process.env.TWITTER_API_SECRET as string,
  },
  VALIDATOR_PRIVATE_KEY: process.env.VALIDATOR_PRIVATE_KEY as string,
  PORT: Number(process.env.PORT || 3000),
} as const;

export default config;
