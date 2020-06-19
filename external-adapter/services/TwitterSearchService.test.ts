import nock, { DataMatcherMap } from 'nock';
import config from '../config';
import SearchNoTweets from '../mocks/twitter/responses/SearchNoTweets.json';
import SearchSingleTweet from '../mocks/twitter/responses/SearchSingleTweet.json';
import SearchMultipleTweets from '../mocks/twitter/responses/SearchMultipleTweets.json';
import OAuth2BearerToken from '../mocks/twitter/responses/OAuth2BearerToken.json';
import TwitterSearchService, {
  InvalidTwitterHashtagError,
} from './TwitterSearchService';
import { Base64 } from 'js-base64';

describe('TwitterSearchService', () => {
  let service: TwitterSearchService;
  const queryMatcher: DataMatcherMap = {
    tweet_mode: 'extended',
    result_type: 'recent',
    include_entities: 'false',
    count: '100',
  };
  const twitterSearchPath = `/${config.TWITTER.API_VERSION}/search/tweets.json`;
  const twitterOAuthPath = '/oauth2/token';

  beforeEach(() => {
    service = new TwitterSearchService();
  });

  describe('Invalid parameters', () => {
    it('should throw exception if invalid hashtag provided', async () => {
      await expect(
        service.searchTweetsByHashtag('%$@#dss'),
      ).rejects.toThrowError(
        new InvalidTwitterHashtagError('Invalid twitter hashtag provided'),
      );
    });
  });

  describe('Authorized requests', () => {
    it('should return empty array of tweets', async () => {
      const searchScope = nock(config.TWITTER.API_URL)
        .get(twitterSearchPath)
        .query({
          q: '#914c1ba9ce114623aa4d5ddb4897dff2 -filter:retweets',
          ...queryMatcher,
        })
        .reply(200, SearchNoTweets);
      const tweets = await service.searchTweetsByHashtag(
        '914c1ba9ce114623aa4d5ddb4897dff2',
      );
      searchScope.done();
      expect(tweets.length).toEqual(0);
    });

    it('should return one tweet', async () => {
      const searchScope = nock(config.TWITTER.API_URL)
        .get(twitterSearchPath)
        .query({
          q: '#dsaSe2FSAFfs -filter:retweets',
          ...queryMatcher,
        })
        .reply(200, SearchSingleTweet);
      const tweets = await service.searchTweetsByHashtag('dsaSe2FSAFfs');
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
          q: '#multipletweetsid -filter:retweets',
          ...queryMatcher,
        })
        .reply(200, SearchMultipleTweets);
      const tweets = await service.searchTweetsByHashtag('multipletweetsid');
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
          q: '#notweets -filter:retweets',
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
          q: '#notweets -filter:retweets',
          ...queryMatcher,
        })
        .reply(200);

      await service.searchTweetsByHashtag('notweets');
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
          q: '#sametoken -filter:retweets',
          ...queryMatcher,
        })
        .reply(200);
      await service.searchTweetsByHashtag('sametoken');
      searchWithTheSameTokenScope.done();
    });
  });
});
