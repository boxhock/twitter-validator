import 'reflect-metadata';
import { Body, JsonController, Post } from 'routing-controllers';
import TwitterValidationRequest from '../dto/twitter/TwitterValidationRequest';
import TwitterDetectorService from '../services/TwitterDetectorService';
import ValidatorSignatureService from '../services/ValidatorSignatureService';
import TwitterValidationResponse from '../dto/twitter/TwitterValidationResponse';

@JsonController()
export default class TwitterController {
  constructor(
    private readonly twitterDetectorService: TwitterDetectorService = new TwitterDetectorService(),
    private readonly validatorSignatureService: ValidatorSignatureService = new ValidatorSignatureService(),
  ) {}

  @Post('/twitter/validate')
  async validateTwitter(
    @Body() dto: TwitterValidationRequest,
  ): Promise<TwitterValidationResponse> {
    const requestData = dto.data;
    const twitterUsername = await this.twitterDetectorService.detectUsernameByTweet(
      {
        userUniqueHashtag: requestData.validationCode,
        tweetText: requestData.domainName,
      },
    );
    const validationSignature = this.validatorSignatureService.sign({
      domainName: requestData.domainName,
      domainOwner: requestData.domainName,
      domainRecordKey: requestData.twitterUsernameKey,
      domainRecordValue: twitterUsername,
    });

    // todo we need to encode all parameters for function call into hex string.
    return {
      jobRunID: dto.id,
      data: {
        domainName: requestData.domainName,
        twitterUsernameKey: dto.data.twitterUsernameKey,
        twitterUsernameValue: twitterUsername,
        validatorSignatureKey: dto.data.validatorSignatureKey,
        validatorSignatureValue: validationSignature,
      },
    };
  }
}
