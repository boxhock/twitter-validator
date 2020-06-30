import TwitterSearchService from './TwitterSearchService';
import TwitterDetectorService, {
  NoTweetsFoundError,
  TweetIsNotValidError,
} from './TwitterDetectorService';

describe('TwitterDetectorService', () => {
  let twitterSearchService: TwitterSearchService;
  let twitterDetectorService: TwitterDetectorService;
  const uniqueHashtag = 'souniquetag';
  const expectedUsername = 'derainberk';

  beforeEach(() => {
    twitterSearchService = new TwitterSearchService();
    twitterDetectorService = new TwitterDetectorService(twitterSearchService);
  });

  it('should return expected username from single tweet', async () => {
    jest.spyOn(twitterSearchService, 'searchTweets').mockResolvedValue([
      {
        text: `#${uniqueHashtag} beresnev.crypto`,
        user: {
          screen_name: expectedUsername,
        },
      },
    ]);
    const username = await twitterDetectorService.detectUsernameByTweet({
      userUniqueHashtag: uniqueHashtag,
      tweetText: 'beresnev.crypto',
    });
    expect(username).toEqual(expectedUsername);
  });

  it('should return expected username from multiple tweets', async () => {
    jest.spyOn(twitterSearchService, 'searchTweets').mockResolvedValue([
      {
        text: 'balal',
        user: {
          screen_name: 'dsadseeed',
        },
      },
      {
        text: 'ggghh',
        user: {
          screen_name: 'etey4312233',
        },
      },
      {
        text: `#${uniqueHashtag} beresnev.crypto`,
        user: {
          screen_name: expectedUsername,
        },
      },
    ]);
    const username = await twitterDetectorService.detectUsernameByTweet({
      userUniqueHashtag: uniqueHashtag,
      tweetText: 'beresnev.crypto',
    });
    expect(username).toEqual(expectedUsername);
  });

  it('should return expected username using unique hashtag only', async () => {
    jest.spyOn(twitterSearchService, 'searchTweets').mockResolvedValue([
      {
        text: uniqueHashtag,
        user: {
          screen_name: expectedUsername,
        },
      },
    ]);
    const username = await twitterDetectorService.detectUsernameByTweet({
      userUniqueHashtag: uniqueHashtag,
    });
    expect(username).toEqual(expectedUsername);
  });

  it('should throw error if no tweets found', async () => {
    jest.spyOn(twitterSearchService, 'searchTweets').mockResolvedValue([]);
    try {
      await twitterDetectorService.detectUsernameByTweet({
        userUniqueHashtag: 'tag',
      });
      fail('Should if no tweets found but it was not');
    } catch (e) {
      expect(e).toBeInstanceOf(NoTweetsFoundError);
    }
  });

  it('should throw error if invalid hashtag in tweet', async () => {
    jest.spyOn(twitterSearchService, 'searchTweets').mockResolvedValue([
      {
        text: '#uniqueTag Text',
        user: {
          screen_name: expectedUsername,
        },
      },
    ]);
    try {
      await twitterDetectorService.detectUsernameByTweet({
        userUniqueHashtag: 'invalidtag',
      });
      fail('Expected search for #invalidtag to throw exception but was not');
    } catch (e) {
      expect(e).toBeInstanceOf(TweetIsNotValidError);
    }
  });

  it('should throw error if invalid text in tweet', async () => {
    jest.spyOn(twitterSearchService, 'searchTweets').mockResolvedValue([
      {
        text: '#valid Text',
        user: {
          screen_name: expectedUsername,
        },
      },
    ]);
    try {
      await twitterDetectorService.detectUsernameByTweet({
        userUniqueHashtag: 'valid',
        tweetText: 'beresnev.crypto',
      });
      fail(
        'Expected search for beresnev.crypto to throw exception but was not',
      );
    } catch (e) {
      expect(e).toBeInstanceOf(TweetIsNotValidError);
    }
  });
});
