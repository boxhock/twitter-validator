import app from './app';

describe('app skeleton test', () => {
  it('should works', () => {
    app.test = 'testing-test';
    expect(app.test).toEqual('testing-test');
  });
});
