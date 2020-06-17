import authorizationChecker from './authorizationChecker';
import config from '../config';

describe('AuthorizationChecker', () => {
  it('should return true for valid headers', () => {
    const authorized = authorizationChecker({
      request: {
        headers: {
          'X-Chainlink-EA-AccessKey': config.CHAINLINK.OUTGOING_TOKEN,
          'X-Chainlink-EA-Secret': config.CHAINLINK.OUTGOING_SECRET,
        },
      },
      response: {},
    });
    expect(authorized).toBeTruthy();
  });

  it('should return false for empty key or secret', () => {
    let authorized = authorizationChecker({
      request: {
        headers: {
          'X-Chainlink-EA-Secret': config.CHAINLINK.OUTGOING_SECRET,
        },
      },
      response: {},
    });
    expect(authorized).toBeFalsy();

    authorized = authorizationChecker({
      request: {
        headers: {
          'X-Chainlink-EA-AccessKey': config.CHAINLINK.OUTGOING_TOKEN,
        },
      },
      response: {},
    });
    expect(authorized).toBeFalsy();
  });

  it('should return false for incorrect key or secret', () => {
    const authorized = authorizationChecker({
      request: {
        headers: {
          'X-Chainlink-EA-AccessKey': 'incorrect',
          'X-Chainlink-EA-Secret': 'incorrect',
        },
      },
      response: {},
    });
    expect(authorized).toBeFalsy();
  });

  it('should return true for correct Bearer', () => {
    const authorized = authorizationChecker({
      request: {
        headers: {
          Bearer: config.AUTHENTICATION_TOKEN,
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
          Bearer: 'incorrect',
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
