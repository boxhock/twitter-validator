import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import authorizationChecker from './authorizationChecker';

const application = createExpressServer({
  authorizationChecker,
  controllers: [__dirname + '/../controllers/*Controller.ts'],
});

export default application;
