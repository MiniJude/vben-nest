import { Injectable } from '@nestjs/common';

import {
  TIME_ZONE_OPTIONS,
  TimezoneOption,
} from '../../common/utils/mock-data';

@Injectable()
export class TimezoneService {
  private currentTimezone: string = 'Asia/Shanghai';

  getOptions(): TimezoneOption[] {
    return TIME_ZONE_OPTIONS;
  }

  getTimezone(): string {
    return this.currentTimezone;
  }

  isValidTimezone(timezone: string): boolean {
    return TIME_ZONE_OPTIONS.some((o) => o.timezone === timezone);
  }

  setTimezone(timezone: string) {
    this.currentTimezone = timezone;
  }
}
