const config = {
  CHAINLINK: {
    ACCESS_KEY: process.env.CHAINLINK_ACCESS_KEY as string,
    ACCESS_SECRET: process.env.CHAINLINK_ACCESS_SECRET as string,
    KEY_HEADER: 'X-Chainlink-EA-AccessKey',
    SECRET_HEADER: 'X-Chainlink-EA-Secret',
    JOB_ID: process.env.CHAINLINK_JOB_ID as string,
    NODE_URL: process.env.CHAINLINK_NODE_URL as string,
  },
  AUTHENTICATION_TOKEN: process.env.AUTHENTICATION_TOKEN as string,
  AUTHENTICATION_TOKEN_HEADER: 'Bearer',
  LISTEN_HTTP_PORT: process.env.LISTEN_HTTP_PORT || (3000 as number),
} as const;

export default config;
