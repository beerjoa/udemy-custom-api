import { inspect } from 'util';

import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { UdemyHttpService } from '#/http/udemy.service';

import { ETaskStatus, Task } from '#schemas/task.schema';
import { CreateTaskDto } from '#tasks/dto/create-task.dto';
import { UpdateTaskDto } from '#tasks/dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly udemyHttpService: UdemyHttpService,
  ) {}

  @Cron('*/2 * * * *')
  async checkDiscountState(): Promise<boolean> {
    const nowDate = new Date();
    const task = await this.taskModel.create({
      title: `checkDiscountState-${nowDate.getTime()}`,
      description: `checking discount state from udemy api at ${nowDate.toLocaleString()}`,
      status: ETaskStatus.OPEN,
    });

    try {
      task.status = ETaskStatus.IN_PROGRESS;

      const course_ids = await this.udemyHttpService.getCourseIdsFromApi();
      const discountStatus = await this.udemyHttpService.getDiscountStatusFromApi(course_ids);

      task.result = { discountStatus };
      task.status = ETaskStatus.DONE;
      this.logger.debug(`discountStatus: ${discountStatus}`, this.constructor.name);
      return discountStatus;
    } catch (error) {
      task.result = { message: error.message, stack: error.stack };
      task.status = ETaskStatus.FAILED;
      this.logger.error(`${inspect(error)}`, this.constructor.name);
      throw error;
    } finally {
      task.updatedAt = new Date();
      await this.taskModel.updateOne({ _id: task._id }, task).exec();
    }
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    await this.checkTaskDuplication(createTaskDto);

    const createdTask = await this.taskModel.create(createTaskDto);

    return createdTask;
  }

  private async checkTaskDuplication(createTaskDto: CreateTaskDto): Promise<Task> {
    createTaskDto;
    const duplicate = null;

    return duplicate;
  }

  async findAll(): Promise<Task[]> {
    const tasks = await this.taskModel.find().exec();

    return tasks;
  }

  async findOne(task_id: string): Promise<Task> {
    const task = await this.taskModel.findById(task_id).exec();

    if (!task) {
      throw new NotFoundException(`Not found, #${task_id} task`);
    }

    return task;
  }

  async update(task_id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(task_id);

    Object.assign(task, updateTaskDto);
    await this.taskModel.updateOne({ _id: task_id }, task).exec();

    return task;
  }

  async remove(task_id: string): Promise<Task> {
    await this.findOne(task_id);

    return await this.taskModel.findByIdAndDelete(task_id).exec();
  }
}
