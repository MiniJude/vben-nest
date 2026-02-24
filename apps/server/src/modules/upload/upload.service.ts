import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  getUrl(): string {
    return 'https://unpkg.com/@vbenjs/static-source@0.1.7/source/logo-v1.webp';
  }
}
