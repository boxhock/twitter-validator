import supertest from 'supertest';
import application from '../utils/application';

describe('JobController', () => {
  it('should return empty json on POST /jobs', async () => {
    const res = await supertest(application).post('/jobs').send();
    expect(res.body).toEqual({});
    expect(res.status).toEqual(200);
  });
});
