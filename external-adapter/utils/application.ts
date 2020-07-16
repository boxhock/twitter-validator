import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import TwitterController from '../controllers/TwitterController';
import ChainlinkAdapterErrorHandler from '../middlewares/ChainlinkAdapterErrorHandler';

const application = createExpressServer({
  defaultErrorHandler: false,
  classTransformer: true,
  controllers: [TwitterController],
  middlewares: [ChainlinkAdapterErrorHandler],
});

export default application;
