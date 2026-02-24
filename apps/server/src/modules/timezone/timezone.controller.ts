import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { Public } from '../../common/decorators/public.decorator';
import { TimezoneService } from './timezone.service';

@Controller('timezone')
export class TimezoneController {
  constructor(private readonly timezoneService: TimezoneService) {}

  @Get('options')
  @Public()
  async getOptions() {
    const options = this.timezoneService.getOptions();
    const data = options.map((o) => ({
      label: `${o.timezone} (GMT${o.offset >= 0 ? `+${o.offset}` : o.offset})`,
      value: o.timezone,
    }));
    return data;
  }

  @Get('getTimezone')
  async getTimezone() {
    const timezone = this.timezoneService.getTimezone();
    return timezone;
  }

  @Post('setTimezone')
  async setTimezone(@Body() body: { timezone: string }) {
    const { timezone } = body;
    if (!timezone || !this.timezoneService.isValidTimezone(timezone)) {
      throw new HttpException('Invalid timezone', HttpStatus.BAD_REQUEST);
    }
    this.timezoneService.setTimezone(timezone);
    return {};
  }
}
