import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import authorizationChecker from './authorizationChecker';
import RunController from '../controllers/RunController';

const application = createExpressServer({
  authorizationChecker,
  controllers: [RunController],
});

export default application;
