import supertest from 'supertest';
import application from '../utils/application';
import config from '../config';
import nock from 'nock';
import JobRunCreated from '../mocks/chainlink-node/responses/JobRunCreated.json';

describe('RunController', () => {
  const jobRunPath = `/v2/specs/${config.CHAINLINK.JOB_ID}/runs`;

  describe('Valid request', () => {
    const request = {
      domainName: 'test.crypto',
      domainOwner: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
      validationCode: 'd4981458019449f5ad8c17aabfd9335c',
      twitterUsernameKey: 'validation.twitter.username',
      validatorSignatureKey: 'validation.twitter.signature',
    };

    it('should return job run data when creating a job run', async () => {
      nock(config.CHAINLINK.NODE_URL as string)
        .post(jobRunPath, request)
        .reply(200, JobRunCreated);
      const res = await supertest(application)
        .post('/runs')
        .set('Bearer', config.AUTHENTICATION_TOKEN)
        .expect(200)
        .send(request);
      expect(res.body).toEqual(JobRunCreated);
    });

    it('should return error if Chainlink Node returns error', async () => {
      nock(config.CHAINLINK.NODE_URL as string)
        .post(jobRunPath)
        .reply(404);
      await supertest(application)
        .post('/runs')
        .set('Bearer', config.AUTHENTICATION_TOKEN)
        .expect(500)
        .send(request);

      nock(config.CHAINLINK.NODE_URL as string)
        .post(jobRunPath)
        .reply(400);
      await supertest(application)
        .post('/runs')
        .set('Bearer', config.AUTHENTICATION_TOKEN)
        .expect(500)
        .send(request);

      nock(config.CHAINLINK.NODE_URL as string)
        .post(jobRunPath)
        .reply(500);
      await supertest(application)
        .post('/runs')
        .set('Bearer', config.AUTHENTICATION_TOKEN)
        .expect(500)
        .send(request);
    });

    it('should return 401 if not authenticated', async () => {
      await supertest(application).post('/runs').expect(401).send(request);
    });
  });

  describe('Invalid request', () => {
    it('should return 400 on invalid request', async () => {
      await supertest(application)
        .post('/runs')
        .set('Bearer', config.AUTHENTICATION_TOKEN)
        .expect(400)
        .send({ invalid: 'request' });
    });
  });
});
