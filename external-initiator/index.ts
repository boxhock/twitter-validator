import 'reflect-metadata';
import config from './config';
import application from './utils/application';
import morganBody from 'morgan-body';
const logger = console;

morganBody(application);
const server = application.listen(config.LISTEN_HTTP_PORT);
logger.info(`Running External Adapter on ${config.LISTEN_HTTP_PORT} port`);

process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());
