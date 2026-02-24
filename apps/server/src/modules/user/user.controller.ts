import { Controller, Get, Request } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get('info')
  async getInfo(@Request() req) {
    return req.user;
  }
}
