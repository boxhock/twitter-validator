import 'reflect-metadata';
import {
  Body,
  Post,
  JsonController,
  Authorized,
  OnNull,
} from 'routing-controllers';
import ChainlinkJobRunService, {
  JobRun,
} from '../services/ChainlinkJobRunService';
import JobRunRequest from '../dto/chainlink/JobRunRequest';

@JsonController()
export default class JobController {
  constructor(
    private readonly jobRunService: ChainlinkJobRunService = new ChainlinkJobRunService(),
  ) {}

  /**
   @api {post} /runs Initiates Twitter Validation.
   @apiName CreateJobRun
   @apiGroup Runs
   @apiHeader {String} Authorization bearer token to pass authorization.

   @apiParam {String} domainName Name of validated domain.
   @apiParam {String} domainOwner Ethereum address of current domain owner.
   @apiParam {String} validationCode Twitter unique hashtag used validation.
   @apiParam {String} twitterUsernameKey `.crypto Resolver` key where twitter username will be set.
   @apiParam {String} validatorSignatureKey `.crypto Resolver` key where validation signature will be placed.

   @apiSuccess {Object} data
   @apiSuccess {String} data.id Job Run ID. Validation progress can be tracked via this id and Chainlink Explorer.
   @apiSuccess {Object} data.attributes
   @apiSuccess {String} data.attributes.jobId ID of the triggered job.
   @apiSuccess {String} data.attributes.createdAt Datetime of Job Run creation.
   @apiSuccessExample Success-Response:
        {
         "data": {
            "id": "2cf990e968484d659bf4bd55623b7143",
            "attributes": {
              "jobId": "5fa0641543b34c8e85fde0ecc10f7eb4",
              "createdAt": "2020-06-15T08:50:44.474824646Z"
            }
          }
        }

   @apiError InvalidRequest parameters have not passed validation.
   @apiErrorExample Error-Response:
       {
         "name":"BadRequestError",
         "message":"Invalid body, check 'errors' property for more info.",
         "stack":"Error: \n    at BadRequestError.HttpError [as constructor]",
         "errors":[
            {
               "target":{
                  "invalid":"request"
               },
               "property":"domainName",
               "constraints":{
                  "matches":"domainName must match /(crypto)$/ regular expression",
                  "isString":"domainName must be a string"
               }
            },
            {
               "target":{
                  "invalid":"request"
               },
               "property":"domainOwner",
               "constraints":{
                  "isEthereumAddress":"domainOwner must be an Ethereum address"
               }
            }
         ]
       }
   */
  @Authorized()
  @OnNull(500)
  @Post('/runs')
  async post(@Body() body: JobRunRequest): Promise<JobRun | null> {
    return this.jobRunService.createJobRun(body);
  }
}
