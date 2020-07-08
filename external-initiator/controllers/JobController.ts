import 'reflect-metadata';
import { Post, JsonController } from 'routing-controllers';

@JsonController()
export default class JobController {
  @Post('/jobs')
  post(): object {
    return {};
  }
}
