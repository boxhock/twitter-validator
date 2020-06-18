import nock from 'nock';
import config from '../config';
import SearchNoTweets from '../mocks/twitter/responses/SearchNoTweets.json';
import TwitterSearchService from './TwitterSearchService';

describe('TwitterSearchService', () => {
  describe('Authorized', () => {
    it('should return empty array of tweets', async () => {
      const searchScope = nock(config.TWITTER.API_URL)
        .get(`/${config.TWITTER.API_VERSION}/search/tweets.json`)
        .query({
          q: '#914c1ba9ce114623aa4d5ddb4897dff2 -filter:retweets',
          tweet_mode: 'extended',
          result_type: 'recent',
          include_entities: 'false',
          count: '100',
        })
        .reply(200, SearchNoTweets);

      const service = new TwitterSearchService();
      const tweets = await service.searchTweetsByHashtag(
        '914c1ba9ce114623aa4d5ddb4897dff2',
      );
      searchScope.done();
      expect(tweets.length).toEqual(0);
    });
  });
});
