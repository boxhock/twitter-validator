import app from './app';

describe('app skeleton test', () => {
  it('should work', () => {
    app.test = 'testing-test';
    expect(app.test).toEqual('testing-test');
  });
});
