import 'reflect-metadata';
import {
  Body,
  Post,
  JsonController,
  Authorized,
  OnNull,
  InternalServerError,
} from 'routing-controllers';
import ChainlinkJobRunService from '../services/ChainlinkJobRunService';

@JsonController()
export default class JobController {
  constructor(
    private readonly jobRunService: ChainlinkJobRunService = new ChainlinkJobRunService(),
  ) {}

  @Authorized()
  @OnNull(500)
  @Post('/runs')
  async post(@Body() body: object): Promise<object | null> {
    try {
      const jobRunData = await this.jobRunService.createJobRun(body);
      return jobRunData.result;
    } catch (e) {
      throw new InternalServerError(e.message);
    }
  }
}
