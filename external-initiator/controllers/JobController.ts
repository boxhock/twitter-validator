import 'reflect-metadata';
import { Post, JsonController, Authorized } from 'routing-controllers';

@JsonController()
export default class JobController {
  @Authorized()
  @Post('/jobs')
  post(): object {
    return {};
  }
}
