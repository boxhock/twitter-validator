import 'reflect-metadata';
import config from './config';
import application from './utils/application';
import morganBody from 'morgan-body';

const logger = console;

morganBody(application);
const server = application.listen(config.PORT);
process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());

logger.info(`Running External Adapter on ${config.PORT} port`);
logger.info(`Validator Ethereum address: ${config.VALIDATOR_ETHEREUM_ADDRESS}`);
logger.info(`Validator public key: ${config.VALIDATOR_PUBLIC_KEY}`);
