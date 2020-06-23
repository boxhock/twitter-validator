import 'reflect-metadata';
import {
  Middleware,
  ExpressErrorMiddlewareInterface,
  BadRequestError,
} from 'routing-controllers';
import { Request, Response } from 'express';

type ErrorResponse = {
  status: string;
  error: string;
  errorData: object;
  jobRunID: string;
};

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
    const errorResponse: ErrorResponse = {
      status: 'errored',
      error: error.message,
      errorData: {},
      jobRunID: request.body.id,
    };
    if (error instanceof BadRequestError) {
      const httpError = error as BadRequestError;
      errorResponse.errorData = httpError;
      response.status(httpError.httpCode);
    } else {
      response.status(500);
    }
    response.json(errorResponse);

    next();
  }
}
