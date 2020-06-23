import 'reflect-metadata';
import { Body, JsonController, Post } from 'routing-controllers';
import TwitterValidationRequest from '../dto/twitter/TwitterValidationRequest';
import TwitterDetectorService from '../services/TwitterDetectorService';
import ValidatorSignatureService from '../services/ValidatorSignatureService';
import TwitterValidationResponse from '../dto/twitter/TwitterValidationResponse';
import TransactionDataEncodeService from '../services/TransactionDataEncodeService';

@JsonController()
export default class TwitterController {
  constructor(
    private readonly twitterDetectorService: TwitterDetectorService = new TwitterDetectorService(),
    private readonly validatorSignatureService: ValidatorSignatureService = new ValidatorSignatureService(),
    private readonly transactionDataEncodeService: TransactionDataEncodeService = new TransactionDataEncodeService(),
  ) {}

  @Post('/twitter/validate')
  async validateTwitter(
    @Body() dto: TwitterValidationRequest,
  ): Promise<TwitterValidationResponse> {
    const data = dto.data;
    const twitterUsername = await this.twitterDetectorService.detectUsernameByTweet(
      {
        userUniqueHashtag: data.validationCode,
        tweetText: data.domainName,
      },
    );
    const validationSignature = this.validatorSignatureService.sign({
      domainName: data.domainName,
      domainOwner: data.domainOwner,
      domainRecordKey: data.twitterUsernameKey,
      domainRecordValue: twitterUsername,
    });
    const transactionData = this.transactionDataEncodeService.encodeDomainValidationData(
      {
        domainName: data.domainName,
        records: {
          [data.twitterUsernameKey]: twitterUsername,
          [data.validatorSignatureKey]: validationSignature,
        },
      },
    );

    return {
      jobRunID: dto.id,
      data: {
        transactionData,
      },
    };
  }
}
