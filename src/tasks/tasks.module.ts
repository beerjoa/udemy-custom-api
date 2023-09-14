import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import httpConfigAsync from '#/config/http.config';

import { Task, TaskSchema } from '#schemas/task.schema';
import { TasksController } from '#tasks/tasks.controller';
import { TasksService } from '#tasks/tasks.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    HttpModule.registerAsync(httpConfigAsync),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
