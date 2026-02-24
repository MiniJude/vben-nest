import { Injectable } from '@nestjs/common';

@Injectable()
export class DemoService {
  async getMessage() {
    return { message: 'Demo API works!' };
  }
}
