import 'reflect-metadata';
import config from './config';
import application from './utils/application';
import morganBody from 'morgan-body';
import Web3 from 'web3';

const web3 = new Web3();
const logger = console;

morganBody(application);
const server = application.listen(config.PORT);
logger.info(`Running External Adapter on ${config.PORT} port`);
logger.info(
  `Validator Ethereum address: ${
    web3.eth.accounts.privateKeyToAccount(config.VALIDATOR_PRIVATE_KEY).address
  }`,
);

process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());
