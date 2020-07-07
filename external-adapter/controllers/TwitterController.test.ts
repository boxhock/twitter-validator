import supertest from 'supertest';
import application from '../utils/application';
import config from '../config';
import nock from 'nock';
import SearchMultipleTweets from '../mocks/twitter/responses/SearchMultipleTweets.json';
import SearchSingleTweet from '../mocks/twitter/responses/SearchSingleTweet.json';
import SearchNoTweets from '../mocks/twitter/responses/SearchNoTweets.json';

describe('TwitterController', () => {
  describe('Validate Twitter', () => {
    const validatePath = '/twitter/validate';
    const request = {
      id: '6d23ab518c614e089beb0444c8b09499',
      data: {
        domainName: 'test.crypto',
        domainOwner: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
        validationCode: 'd4981458019449f5ad8c17aabfd9335c',
      },
    };
    describe('Valid request', () => {
      beforeEach(() => {
        nock(config.TWITTER.API_URL as string)
          .get(new RegExp('.'))
          .query(true)
          .reply(200, SearchMultipleTweets);
      });

      it('should return valid transaction data', async () => {
        const res = await supertest(application)
          .post(validatePath)
          .expect(200)
          .send(request);
        const expectedTransactionData =
          '0x000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a0b72f443a17edf4a55f766cf3c83469e6f96494b16823a41a4acb25800f303103000000000000000000000000000000000000000000000000000000000000000a64657261696e6265726b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008430783936386235343135313839373139383630336530343631363861636236373262303634353931633865333865356631323864306262656332316133663030646635373433356337333338343461323939366631346338666263623262373736653833336230656363306234323236663538373863613439646435383232666634316300000000000000000000000000000000000000000000000000000000';
        expect(res.body.data.transactionData).toEqual(expectedTransactionData);
      });

      it('should return same job run id as provided in request', async () => {
        const res = await supertest(application)
          .post(validatePath)
          .expect(200)
          .send(request);
        expect(res.body.jobRunID).toEqual(request.id);
      });
    });

    describe('Invalid request', () => {
      it('should return error if no tweets found', async () => {
        nock(config.TWITTER.API_URL as string)
          .get(new RegExp('.'))
          .query(true)
          .reply(200, SearchNoTweets);
        const res = await supertest(application)
          .post(validatePath)
          .expect(500)
          .send(request);
        expect(res.body.status).toEqual('errored');
      });

      it('should return error not valid request', async () => {
        nock(config.TWITTER.API_URL as string)
          .get(new RegExp('.'))
          .query(true)
          .reply(200, SearchMultipleTweets);
        const res = await supertest(application)
          .post(validatePath)
          .expect(400)
          .send({ invalid: 'request' });
        expect(res.body.status).toEqual('errored');
      });

      it('should return jobRunID with error', async () => {
        const res = await supertest(application)
          .post(validatePath)
          .expect(400)
          .send({ id: 'test' });
        expect(res.body.jobRunID).toEqual('test');
      });

      it("should return error if can't find valid tweet", async () => {
        nock(config.TWITTER.API_URL as string)
          .get(new RegExp('.'))
          .query(true)
          .reply(200, SearchSingleTweet);
        const res = await supertest(application)
          .post(validatePath)
          .expect(500)
          .send(request);
        expect(res.body.status).toEqual('errored');
      });
    });
  });
});
