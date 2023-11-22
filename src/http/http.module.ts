import { HttpModule as AxiosHttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { httpConfigAsync } from '#core/config';
import { UdemyController } from '#http/udemy.controller';
import { UdemyHttpService } from '#http/udemy.service';

import { Task, TaskSchema } from '#schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    AxiosHttpModule.registerAsync(httpConfigAsync),
  ],
  providers: [UdemyHttpService],
  exports: [UdemyHttpService],
  controllers: [UdemyController],
})
export class HttpModule {}
