import { HttpModule as AxiosHttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import httpConfigAsync from '#config/http.config';
import { UdemyHttpService } from '#http/udemy.service';

@Module({
  imports: [AxiosHttpModule.registerAsync(httpConfigAsync)],
  providers: [UdemyHttpService],
  exports: [UdemyHttpService],
})
export class HttpModule {}
