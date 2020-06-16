import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import authorizationChecker from './authorizationChecker';
import JobController from '../controllers/JobController';
import RunController from '../controllers/RunController';

const application = createExpressServer({
  authorizationChecker,
  controllers: [JobController, RunController],
});

export default application;
