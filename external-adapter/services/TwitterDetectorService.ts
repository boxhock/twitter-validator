import TwitterSearchService, { Tweet } from './TwitterSearchService';
import * as _ from 'lodash';

type ValidationRequest = {
  userUniqueHashtag: string;
  tweetText?: string;
};

export class NoTweetsFoundError extends Error {}
export class TweetIsNotValidError extends Error {}

export default class TwitterDetectorService {
  constructor(
    private readonly twitterSearchService: TwitterSearchService = new TwitterSearchService(),
  ) {}

  async detectUsernameByTweet(request: ValidationRequest): Promise<string> {
    const tweets = await this.twitterSearchService.searchTweets({
      hashtag: request.userUniqueHashtag,
      text: request.tweetText,
    });
    if (tweets.length === 0) {
      throw new NoTweetsFoundError(
        `No tweets found for #${request.userUniqueHashtag} ${request.tweetText}`,
      );
    }
    const firstPostedTweet = _.last(tweets);
    this.validateTweet(request, firstPostedTweet);

    return firstPostedTweet!.user.screen_name;
  }

  private validateTweet(
    request: ValidationRequest,
    firstTweetPosted: Tweet | undefined,
  ): void {
    if (
      !firstTweetPosted ||
      this.hashtagNotValid(request, firstTweetPosted as Tweet) ||
      this.textNotValid(request, firstTweetPosted as Tweet)
    ) {
      throw new TweetIsNotValidError(
        `Tweet does not includes unique hashtag or text`,
      );
    }
  }

  private textNotValid(
    request: ValidationRequest,
    firstTweetPosted: Tweet,
  ): boolean {
    if (!request.tweetText) {
      return false;
    }
    return !firstTweetPosted.text.includes(request.tweetText);
  }

  private hashtagNotValid(
    request: ValidationRequest,
    firstTweetPosted: Tweet,
  ): boolean {
    return !firstTweetPosted.text.includes(request.userUniqueHashtag);
  }
}
