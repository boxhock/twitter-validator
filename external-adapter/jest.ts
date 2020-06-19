import nock from 'nock';

beforeAll(() => {
  nock.disableNetConnect();
});

afterAll(async () => {
  nock.enableNetConnect();
});
