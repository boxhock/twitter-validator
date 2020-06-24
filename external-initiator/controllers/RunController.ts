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

@JsonController()
export default class JobController {
  constructor(
    private readonly jobRunService: ChainlinkJobRunService = new ChainlinkJobRunService(),
  ) {}

  @Authorized()
  @OnNull(500)
  @Post('/runs')
  async post(@Body() body: object): Promise<JobRun | null> {
    return this.jobRunService.createJobRun(body);
  }
}
