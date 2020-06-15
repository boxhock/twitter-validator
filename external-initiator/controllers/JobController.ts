import { Post, JsonController, Authorized } from 'routing-controllers';

@JsonController()
export class JobController {
  @Authorized()
  @Post('/jobs')
  post(): object {
    return {};
  }
}
