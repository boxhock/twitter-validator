import { Action } from 'routing-controllers';
import config from '../config';
import * as _ from 'lodash';

const allowedToBearer = (action: Action) => {
  const bearerToken =
    action.request.headers[config.AUTHENTICATION_TOKEN_HEADER] ||
    action.request.headers[config.AUTHENTICATION_TOKEN_HEADER.toLowerCase()];
  return bearerToken && bearerToken === config.AUTHENTICATION_TOKEN;
};

export default (action: Action): boolean => {
  return (
    _.has(action, 'request.headers') &&
    _.isObject(action.request.headers) &&
    allowedToBearer(action)
  );
};
