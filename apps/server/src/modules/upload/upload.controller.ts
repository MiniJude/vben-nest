import { Controller, Post } from '@nestjs/common';

import { Public } from '../../common/decorators/public.decorator';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @Public()
  async upload() {
    const url = this.uploadService.getUrl();
    return { url };
  }
}
