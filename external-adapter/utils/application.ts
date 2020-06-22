import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import TwitterController from '../controllers/TwitterController';
import ChainlinkAdapterErrorHandler from '../middlewares/ChainlinkAdapterErrorHandler';

const application = createExpressServer({
  controllers: [TwitterController],
  middlewares: [ChainlinkAdapterErrorHandler],
});

export default application;
