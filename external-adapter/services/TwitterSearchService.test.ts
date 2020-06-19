import nock, { DataMatcherMap } from 'nock';
import config from '../config';
import SearchNoTweets from '../mocks/twitter/responses/SearchNoTweets.json';
import SearchSingleTweet from '../mocks/twitter/responses/SearchSingleTweet.json';
import SearchMultipleTweets from '../mocks/twitter/responses/SearchMultipleTweets.json';
import OAuth2BearerToken from '../mocks/twitter/responses/OAuth2BearerToken.json';
import TwitterSearchService, {
  InvalidTwitterHashtagError,
  TooMuchTweetsInResponseError,
} from './TwitterSearchService';
import { Base64 } from 'js-base64';
import qs from 'qs';

describe('TwitterSearchService', () => {
  let service: TwitterSearchService;
  let queryMatcher: DataMatcherMap;
  const twitterSearchPath = `/${config.TWITTER.API_VERSION}/search/tweets.json`;
  const twitterOAuthPath = '/oauth2/token';

  beforeEach(() => {
    service = new TwitterSearchService();
    queryMatcher = {
      result_type: 'recent',
      include_entities: 'false',
      count: 100,
      max_id: '',
    };
  });

  describe('Invalid parameters', () => {
    it('should throw exception if invalid hashtag provided', async () => {
      try {
        await service.searchTweets({ hashtag: '$#@%%', text: 'test.crypto' });
        fail('Should fail');
      } catch (e) {
        expect(e).toBeInstanceOf(InvalidTwitterHashtagError);
      }
    });
  });

  describe('Authorized requests', () => {
    it('should return empty array of tweets', async () => {
      const searchScope = nock(config.TWITTER.API_URL)
        .get(twitterSearchPath)
        .query({
          q: '#914c1ba9ce114623aa4d5ddb4897dff2 test.crypto -filter:retweets',
          ...queryMatcher,
        })
        .reply(200, SearchNoTweets);
      const tweets = await service.searchTweets({
        hashtag: '914c1ba9ce114623aa4d5ddb4897dff2',
        text: 'test.crypto',
      });
      searchScope.done();
      expect(tweets.length).toEqual(0);
    });

    it('should return one tweet', async () => {
      const searchScope = nock(config.TWITTER.API_URL)
        .get(twitterSearchPath)
        .query({
          q: '#dsaSe2FSAFfs test.crypto -filter:retweets',
          ...queryMatcher,
        })
        .reply(200, SearchSingleTweet);
      const tweets = await service.searchTweets({
        hashtag: 'dsaSe2FSAFfs',
        text: 'test.crypto',
      });
      searchScope.done();
      expect(tweets.length).toEqual(1);
      expect(tweets[0].text).toEqual(SearchSingleTweet.statuses[0].text);
      expect(tweets[0].user.screen_name).toEqual(
        SearchSingleTweet.statuses[0].user.screen_name,
      );
    });

    it('should return multiple tweets', async () => {
      const searchScope = nock(config.TWITTER.API_URL)
        .get(twitterSearchPath)
        .query({
          q: '#multipletweetsid  -filter:retweets',
          ...queryMatcher,
        })
        .reply(200, SearchMultipleTweets);
      const tweets = await service.searchTweets({
        hashtag: 'multipletweetsid',
      });
      searchScope.done();
      expect(tweets.length).toEqual(3);
    });
  });

  describe('Authentication flow', () => {
    const encodedCredentials = Base64.encode(
      `${encodeURIComponent(config.TWITTER.API_KEY)}:${encodeURIComponent(
        config.TWITTER.API_SECRET,
      )}`,
    );

    it('should request bearer token if getting 401 error', async () => {
      // Try to search tweets without Bearer token
      const nonAuthenticatedScope = nock(config.TWITTER.API_URL, {
        reqheaders: {
          Authorization: 'Bearer undefined',
        },
      })
        .get(twitterSearchPath)
        .query({
          q: '#notweets  -filter:retweets',
          ...queryMatcher,
        })
        .reply(401);

      // Request new bearer token
      const getCredentialsScope = nock(config.TWITTER.API_URL, {
        reqheaders: {
          Authorization: `Basic ${encodedCredentials}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .post(twitterOAuthPath, 'grant_type=client_credentials')
        .reply(200, OAuth2BearerToken);

      // Search tweets with new Bearer token
      const authenticatedScope = nock(config.TWITTER.API_URL, {
        reqheaders: {
          Authorization: `Bearer ${OAuth2BearerToken.access_token}`,
        },
      })
        .get(twitterSearchPath)
        .query({
          q: '#notweets  -filter:retweets',
          ...queryMatcher,
        })
        .reply(200);

      await service.searchTweets({ hashtag: 'notweets' });
      nonAuthenticatedScope.done();
      getCredentialsScope.done();
      authenticatedScope.done();

      // Search tweets with saved bearer token
      const searchWithTheSameTokenScope = nock(config.TWITTER.API_URL, {
        reqheaders: {
          Authorization: `Bearer ${OAuth2BearerToken.access_token}`,
        },
      })
        .get(twitterSearchPath)
        .query({
          q: '#sametoken  -filter:retweets',
          ...queryMatcher,
        })
        .reply(200);
      await service.searchTweets({ hashtag: 'sametoken' });
      searchWithTheSameTokenScope.done();
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      const tweetsPerRequest = SearchMultipleTweets.statuses.length;
      service = new TwitterSearchService(tweetsPerRequest);
      queryMatcher = {
        result_type: 'recent',
        include_entities: 'false',
        count: tweetsPerRequest,
      };
    });

    it('should request next results if received multiple pages of tweets', async () => {
      const expectedMaxId = qs.parse(
        SearchMultipleTweets.search_metadata.next_results,
        { ignoreQueryPrefix: true },
      ).max_id;
      const firstPageScope = nock(config.TWITTER.API_URL)
        .get(twitterSearchPath)
        .query({
          ...queryMatcher,
          max_id: '',
          q: '#unstoppable beresnev.crypto -filter:retweets',
        })
        .reply(200, SearchMultipleTweets);

      const secondsPageScope = nock(config.TWITTER.API_URL)
        .get(twitterSearchPath)
        .query({
          ...queryMatcher,
          q: '#unstoppable beresnev.crypto -filter:retweets',
          max_id: expectedMaxId,
        })
        .reply(200, SearchMultipleTweets);

      const thirdEmptyPageScope = nock(config.TWITTER.API_URL)
        .get(twitterSearchPath)
        .query({
          ...queryMatcher,
          q: '#unstoppable beresnev.crypto -filter:retweets',
          max_id: expectedMaxId,
        })
        .reply(200, SearchNoTweets);

      const tweets = await service.searchTweets({
        hashtag: 'unstoppable',
        text: 'beresnev.crypto',
      });
      expect(tweets.length).toEqual(6);
      expect(tweets[2].text).toEqual(tweets[5].text);
      firstPageScope.done();
      secondsPageScope.done();
      thirdEmptyPageScope.done();
    });

    it('should throw exception if can not receive all tweets by provided hashtag', async () => {
      nock(config.TWITTER.API_URL)
        .get(twitterSearchPath)
        .query({
          ...queryMatcher,
          max_id: '',
          q: '#unstoppable beresnev.crypto -filter:retweets',
        })
        .reply(200, SearchMultipleTweets);

      const expectedMaxId = qs.parse(
        SearchMultipleTweets.search_metadata.next_results,
        { ignoreQueryPrefix: true },
      ).max_id;
      const infinityPagesScope = nock(config.TWITTER.API_URL)
        .get(twitterSearchPath)
        .query({
          ...queryMatcher,
          q: '#unstoppable beresnev.crypto -filter:retweets',
          max_id: expectedMaxId,
        })
        .reply(200, SearchMultipleTweets);
      infinityPagesScope.persist();

      try {
        await service.searchTweets({
          hashtag: 'unstoppable',
          text: 'beresnev.crypto',
        });
        fail('Should fail');
      } catch (e) {
        expect(e).toBeInstanceOf(TooMuchTweetsInResponseError);
      }
      infinityPagesScope.persist(false);
    });
  });
});
