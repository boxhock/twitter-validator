import 'reflect-metadata';
import { Body, JsonController, Post } from 'routing-controllers';
import TwitterValidationRequest from '../dto/twitter/TwitterValidationRequest';
import TwitterDetectorService from '../services/TwitterDetectorService';
import ValidatorSignatureService from '../services/ValidatorSignatureService';
import TwitterValidationResponse from '../dto/twitter/TwitterValidationResponse';
import TransactionDataEncodeService from '../services/TransactionDataEncodeService';
import config from '../config';

@JsonController()
export default class TwitterController {
  constructor(
    private readonly twitterDetectorService: TwitterDetectorService = new TwitterDetectorService(),
    private readonly validatorSignatureService: ValidatorSignatureService = new ValidatorSignatureService(),
    private readonly transactionDataEncodeService: TransactionDataEncodeService = new TransactionDataEncodeService(),
  ) {}

  /**
   @api {post} /twitter/validate Validate twitter account and return signature and twitter username packed as smart contract arguments (transaction data). This endpoint should be called by Chainlink Node as a part of the Job.
   @apiName TwitterValidate
   @apiGroup Twitter

   @apiParam {String} id Job Run ID
   @apiParam {Object} data
   @apiParam {String} data.domainName Name of validated domain.
   @apiParam {String} data.domainOwner Ethereum address of current domain owner.
   @apiParam {String} data.validationCode Twitter unique hashtag used validation.
   */
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
    const signResult = this.validatorSignatureService.sign({
      domainName: data.domainName,
      domainOwner: data.domainOwner,
      domainRecordKey: config.TWITTER.DOMAIN_RECORD_KEY,
      domainRecordValue: twitterUsername,
    });
    const transactionData = this.transactionDataEncodeService.encodeDomainValidationData(
      {
        domainName: data.domainName,
        domainRecordValue: twitterUsername,
        domainRecordSignature: signResult.signature,
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
