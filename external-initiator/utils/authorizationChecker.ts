import { Action } from 'routing-controllers';
import config from '../config';
import * as _ from 'lodash';

const allowedToChainlinkNode = (action: Action) => {
  const key =
    action.request.headers[config.CHAINLINK.KEY_HEADER] ||
    action.request.headers[config.CHAINLINK.KEY_HEADER.toLowerCase()];
  const secret =
    action.request.headers[config.CHAINLINK.SECRET_HEADER] ||
    action.request.headers[config.CHAINLINK.SECRET_HEADER.toLowerCase()];
  return (
    key &&
    secret &&
    key === config.CHAINLINK.OUTGOING_TOKEN &&
    secret === config.CHAINLINK.OUTGOING_SECRET
  );
};

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
    (allowedToBearer(action) || allowedToChainlinkNode(action))
  );
};
