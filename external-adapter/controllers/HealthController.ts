import 'reflect-metadata';
import { Get, JsonController } from 'routing-controllers';

@JsonController()
export default class JobController {
  @Get('/health')
  get(): object {
    return {};
  }
}
