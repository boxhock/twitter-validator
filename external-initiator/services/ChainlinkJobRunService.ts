import config from '../config';
import { RestClient } from 'typed-rest-client/RestClient';

export type JobRun = {
  data: {
    id: string;
    attributes: {
      jobId: string;
      createdAt: string;
    };
  };
};

export default class ChainlinkJobRunService {
  constructor(
    private readonly client: RestClient = new RestClient(
      null,
      config.CHAINLINK.NODE_URL,
      [],
      {
        headers: {
          [config.CHAINLINK.KEY_HEADER]: config.CHAINLINK.ACCESS_KEY,
          [config.CHAINLINK.SECRET_HEADER]: config.CHAINLINK.ACCESS_SECRET,
        },
      },
    ),
    private readonly options = {
      jobId: config.CHAINLINK.JOB_ID,
    },
  ) {}

  async createJobRun(jobPayload: object): Promise<JobRun | null> {
    const jobRun = await this.client.create<JobRun>(
      `/v2/specs/${this.options.jobId}/runs`,
      jobPayload,
    );

    return jobRun.result;
  }
}
