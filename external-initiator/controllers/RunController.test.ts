import supertest from 'supertest';
import application from '../utils/application';
import config from '../config';
import nock from 'nock';
import JobRunCreated from '../mocks/chainlink-node/responses/JobRunCreated.json';

describe('RunController', () => {
  const jobRunPath = `/v2/specs/${config.CHAINLINK.JOB_ID}/runs`;

  it('should return job run data when creating a job run', async () => {
    nock(config.CHAINLINK.NODE_URL as string)
      .post(jobRunPath, { job: 'data' })
      .reply(200, JobRunCreated);
    const res = await supertest(application)
      .post('/runs')
      .set('Bearer', config.AUTHENTICATION_TOKEN)
      .expect(200)
      .send({ job: 'data' });
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
      .send();

    nock(config.CHAINLINK.NODE_URL as string)
      .post(jobRunPath)
      .reply(400);
    await supertest(application)
      .post('/runs')
      .set('Bearer', config.AUTHENTICATION_TOKEN)
      .expect(500)
      .send();

    nock(config.CHAINLINK.NODE_URL as string)
      .post(jobRunPath)
      .reply(500);
    await supertest(application)
      .post('/runs')
      .set('Bearer', config.AUTHENTICATION_TOKEN)
      .expect(500)
      .send();
  });

  it('should return 401 if not authenticated', async () => {
    await supertest(application).post('/runs').expect(401).send();
  });
});
