const config = {
  CHAINLINK: {
    ACCESS_KEY: process.env.CHAINLINK_ACCESS_KEY as string,
    ACCESS_SECRET: process.env.CHAINLINK_ACCESS_SECRET as string,
    ACCESS_KEY_HEADER: 'X-Chainlink-EA-AccessKey',
    ACCESS_SECRET_HEADER: 'X-Chainlink-EA-Secret',
    JOB_ID: process.env.CHAINLINK_JOB_ID,
    NODE_URL: process.env.CHAINLINK_NODE_URL,
  },
  AUTH_KEY_HEADER: 'X-Chainlink-EA-AccessKey',
  AUTH_SECRET_HEADER: 'X-Chainlink-EA-Secret',
  AUTH_KEY: process.env.AUTHENTICATION_TOKEN as string,
  AUTH_SECRET: process.env.AUTHENTICATION_SECRET as string,
  LISTEN_HTTP_PORT: process.env.LISTEN_HTTP_PORT || (3000 as number),
} as const;

export default config;
