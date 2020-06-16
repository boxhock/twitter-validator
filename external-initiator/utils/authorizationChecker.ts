import { Action } from 'routing-controllers';
import config from '../config';

export default (action: Action): boolean => {
  const key =
    action.request.headers[config.AUTH_KEY_HEADER] ||
    action.request.headers[config.AUTH_KEY_HEADER.toLowerCase()];
  const secret =
    action.request.headers[config.AUTH_SECRET_HEADER] ||
    action.request.headers[config.AUTH_SECRET_HEADER.toLowerCase()];
  return (
    key && secret && key === config.AUTH_KEY && secret === config.AUTH_SECRET
  );
};
