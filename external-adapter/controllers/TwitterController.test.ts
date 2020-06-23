import supertest from 'supertest';
import application from '../utils/application';
import config from '../config';
import nock from 'nock';
import * as _ from 'lodash';
import SearchMultipleTweets from '../mocks/twitter/responses/SearchMultipleTweets.json';
import SearchSingleTweet from '../mocks/twitter/responses/SearchSingleTweet.json';
import SearchNoTweets from '../mocks/twitter/responses/SearchNoTweets.json';
import ValidatorSignatureService from '../services/ValidatorSignatureService';
import TransactionDataEncodeService from '../services/TransactionDataEncodeService';

const validatorSignatureService = new ValidatorSignatureService();
const transactionDataEncodeService = new TransactionDataEncodeService();

function generateExpectedTransactionData(requestData: {
  id: string;
  data: {
    domainName: string;
    domainOwner: string;
    validationCode: string;
    twitterUsernameKey: string;
    validatorSignatureKey: string;
  };
}) {
  const twitterUsername = _.last(SearchMultipleTweets.statuses)!.user
    .screen_name;
  const signature = validatorSignatureService.sign({
    domainName: requestData.data.domainName,
    domainRecordValue: twitterUsername,
    domainRecordKey: requestData.data.twitterUsernameKey,
    domainOwner: requestData.data.domainOwner,
  });

  return transactionDataEncodeService.encodeDomainValidationData({
    domainName: requestData.data.domainName,
    records: {
      [requestData.data.twitterUsernameKey]: twitterUsername,
      [requestData.data.validatorSignatureKey]: signature,
    },
  });
}

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
        const expectedTransactionData = generateExpectedTransactionData(
          request,
        );
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
