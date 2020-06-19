import config from '../config';
import { RestClient } from 'typed-rest-client/RestClient';
import {
  IHttpClient,
  IHttpClientResponse,
  IRequestHandler,
  IRequestInfo,
} from 'typed-rest-client/Interfaces';
import { Base64 } from 'js-base64';
import * as _ from 'lodash';
import { RequestOptions } from 'http';

type Tweet = {
  text: string;
  user: {
    screen_name: string;
  };
};

type Tweets = {
  statuses: Tweet[];
};

export class InvalidTwitterHashtagError extends Error {}

export default class TwitterSearchService {
  private readonly invalidHashtagDetector: RegExp = /[^\w]/;

  constructor(
    private readonly client: RestClient = new RestClient(
      null,
      `${config.TWITTER.API_URL}`,
      [
        new TwitterAuthenticationHandler(
          config.TWITTER.API_URL,
          config.TWITTER.API_KEY,
          config.TWITTER.API_SECRET,
        ),
      ],
    ),
  ) {}

  async searchTweetsByHashtag(hashtag: string): Promise<Tweet[]> {
    if (this.invalidHashtagDetector.test(hashtag)) {
      throw new InvalidTwitterHashtagError('Invalid twitter hashtag provided');
    }
    const tweets = await this.client.get<Tweets>(
      `/${config.TWITTER.API_VERSION}/search/tweets.json`,
      {
        queryParameters: {
          params: {
            q: `#${hashtag} -filter:retweets`,
            tweet_mode: 'extended',
            result_type: 'recent',
            include_entities: 'false',
            count: '100',
          },
        },
      },
    );

    return tweets.result ? tweets.result.statuses : [];
  }
}

class TwitterAuthenticationHandler implements IRequestHandler {
  private readonly oauthPath = '/oauth2/token';
  private accessToken: string;

  constructor(
    private readonly apiUrl: string,
    private readonly apiKey: string,
    private readonly apiSecret: string,
  ) {}

  prepareRequest(options: RequestOptions): void {
    if (options.path !== this.oauthPath) {
      _.set(options, 'headers.Authorization', `Bearer ${this.accessToken}`);
    }
  }

  canHandleAuthentication(response: IHttpClientResponse): boolean {
    return true;
  }

  async handleAuthentication(
    httpClient: IHttpClient,
    requestInfo: IRequestInfo,
    objs: any,
  ): Promise<IHttpClientResponse> {
    this.accessToken = await this.requestAccessToken(httpClient);
    const authenticatedRequestInfo = requestInfo;
    _.set(
      authenticatedRequestInfo.options,
      'headers.Authorization',
      `Bearer ${this.accessToken}`,
    );
    return httpClient.requestRaw(authenticatedRequestInfo, objs);
  }

  private async requestAccessToken(httpClient: IHttpClient): Promise<string> {
    const encodedCredentials = Base64.encode(
      `${encodeURIComponent(this.apiKey)}:${encodeURIComponent(
        this.apiSecret,
      )}`,
    );
    const tokenResponse = await httpClient.post(
      `${this.apiUrl}${this.oauthPath}`,
      'grant_type=client_credentials',
      {
        Authorization: `Basic ${encodedCredentials}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    );
    if (tokenResponse.message.statusCode !== 200) {
      throw new Error(await tokenResponse.readBody());
    }
    const tokenJson = JSON.parse(await tokenResponse.readBody());
    return tokenJson.access_token;
  }
}
