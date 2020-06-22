import 'reflect-metadata';
import {
  Middleware,
  ExpressErrorMiddlewareInterface,
} from 'routing-controllers';
import { Request, Response } from 'express';

@Middleware({ type: 'after' })
export default class ChainlinkAdapterErrorHandler
  implements ExpressErrorMiddlewareInterface {
  /**
   * This behaviour requested by Chainlink Node
   * @see https://docs.chain.link/docs/developers#returning-data
   */
  error(
    error: Error,
    request: Request,
    response: Response,
    next: () => {},
  ): void {
    response
      .json({
        status: 'errored',
        error: error.message,
        jobRunID: request.body.id,
      })
      .send();

    next();
  }
}
