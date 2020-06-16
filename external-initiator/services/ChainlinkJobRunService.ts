import config from '../config';
import { IRestResponse, RestClient } from 'typed-rest-client/RestClient';

type JobRun = {
  data: {
    id: string;
  };
  attributes: {
    jobId: string;
    createdAt: string;
  };
};

export default class ChainlinkJobRunService {
  constructor(
    private readonly client: RestClient = new RestClient(
      null,
      config.CHAINLINK.NODE_URL,
    ),
    private readonly options = {
      jobId: config.CHAINLINK.JOB_ID,
      accessHeaders: {
        [config.CHAINLINK.ACCESS_KEY_HEADER]: config.CHAINLINK.ACCESS_KEY,
        [config.CHAINLINK.ACCESS_SECRET_HEADER]: config.CHAINLINK.ACCESS_SECRET,
      },
    },
  ) {}

  async createJobRun(jobPayload: object): Promise<IRestResponse<JobRun>> {
    return this.client.create<JobRun>(
      `/v2/specs/${this.options.jobId}/runs`,
      jobPayload,
      {
        additionalHeaders: this.options.accessHeaders,
      },
    );
  }
}
