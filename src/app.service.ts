import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getObjective(): string {
    return "Stay sober, don't quit your job.";
  }
}
