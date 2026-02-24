import { resolve } from 'node:path';
import { cwd, env } from 'node:process';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './common/guards/auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { DemoModule } from './modules/demo/demo.module';
import { SystemModule } from './modules/system/system.module';
import { TableModule } from './modules/table/table.module';
import { TimezoneModule } from './modules/timezone/timezone.module';
import { UploadModule } from './modules/upload/upload.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath: [
        resolve(cwd(), `apps/server/.env.${env.NODE_ENV || 'development'}`),
        resolve(cwd(), `.env.${env.NODE_ENV || 'development'}`),
      ],
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    SystemModule,
    TableModule,
    TimezoneModule,
    UploadModule,
    DemoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
