import authorizationChecker from './authorizationChecker';
import config from '../config';

describe('AuthorizationChecker', () => {
  it('should return true for correct Bearer', () => {
    const authorized = authorizationChecker({
      request: {
        headers: {
          Authorization: config.AUTHENTICATION_TOKEN,
        },
      },
      response: {},
    });
    expect(authorized).toBeTruthy();
  });

  it('should return false for incorrect Bearer', () => {
    const authorized = authorizationChecker({
      request: {
        headers: {
          Authorization: 'incorrect',
        },
      },
      response: {},
    });
    expect(authorized).toBeFalsy();
  });

  it('should return false for empty headers', () => {
    const authorized = authorizationChecker({
      request: {},
      response: {},
    });
    expect(authorized).toBeFalsy();
  });
});
