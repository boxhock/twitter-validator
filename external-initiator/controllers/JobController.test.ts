import supertest from 'supertest';
import application from '../utils/application';
import config from '../config';

describe('JobController', () => {
  it('should return empty json on POST /jobs', async () => {
    const res = await supertest(application)
      .post('/jobs')
      .set('X-Chainlink-EA-AccessKey', config.AUTH_KEY)
      .set('X-Chainlink-EA-Secret', config.AUTH_SECRET)
      .send();
    expect(res.body).toEqual({});
    expect(res.status).toEqual(200);
  });

  it('should return error if authentication fails', async () => {
    await supertest(application).post('/jobs').expect(401).send();
  });
});
