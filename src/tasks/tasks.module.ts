import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HttpModule } from '#http/http.module';
import { TasksController } from '#tasks/tasks.controller';
import { TasksService } from '#tasks/tasks.service';

import { Task, TaskSchema } from '#schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]), HttpModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
