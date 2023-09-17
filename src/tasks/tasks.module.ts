import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HttpModule } from '#http/http.module';
import { Task, TaskSchema } from '#schemas/task.schema';
import { TasksController } from '#tasks/tasks.controller';
import { TasksService } from '#tasks/tasks.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]), HttpModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
