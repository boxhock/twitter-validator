const config = {
  VALIDATOR_PRIVATE_KEY: process.env.VALIDATOR_PRIVATE_KEY as string,
  LISTEN_HTTP_PORT: process.env.LISTEN_HTTP_PORT || (3000 as number),
} as const;

export default config;
