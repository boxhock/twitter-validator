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
        twitterUsernameKey: 'validation.twitter.username',
        validatorSignatureKey: 'validation.twitter.signature',
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
          '0xb72f443a17edf4a55f766cf3c83469e6f96494b16823a41a4acb25800f30310300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000001b76616c69646174696f6e2e747769747465722e757365726e616d650000000000000000000000000000000000000000000000000000000000000000000000001c76616c69646174696f6e2e747769747465722e7369676e617475726500000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000a64657261696e6265726b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008430783965353831646633383765376138343433653636336435386663313736303034356433666362376165643234393633376163633737376262653837643561333934326431363130643265386538626437353066643533633230643466633661383536303737623235656439653538356439616161336439646535626365376238316200000000000000000000000000000000000000000000000000000000';
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
