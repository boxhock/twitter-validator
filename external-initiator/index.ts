import config from './config';
import application from './utils/application';
import morganBody from 'morgan-body';

morganBody(application);
application.listen(config.LISTEN_HTTP_PORT);
