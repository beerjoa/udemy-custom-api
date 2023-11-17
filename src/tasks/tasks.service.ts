import { inspect } from 'util';

import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { UdemyHttpService } from '#http/udemy.service';
import { CreateTaskDto } from '#tasks/dto/create-task.dto';
import { UpdateTaskDto } from '#tasks/dto/update-task.dto';

import { ETaskStatus, ETaskType, Task } from '#schemas';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly udemyHttpService: UdemyHttpService,
  ) {}

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

  // Schedule Job
  @Cron(CronExpression.EVERY_HOUR)
  async checkDiscountStatus(): Promise<boolean> {
    const countryCode = 'US';
    const nowDate = new Date();
    const task = await this.taskModel.create({
      title: `checkDiscountStatus-${countryCode}-${nowDate.getTime()}`,
      description: `checking discount status for ${countryCode} from udemy api at ${nowDate.toLocaleString()}`,
      status: ETaskStatus.OPEN,
      type: ETaskType.CHECK_DISCOUNT_STATUS,
    });

    try {
      task.status = ETaskStatus.IN_PROGRESS;

      const courseIds = await this.udemyHttpService.getCourseIdsFromApi(countryCode);
      const discountStatus = await this.udemyHttpService.getDiscountStatusFromApi(countryCode, courseIds);

      task.result = { discountStatus };
      task.status = ETaskStatus.DONE;

      this.logger.debug(`discountStatus: ${discountStatus}`, this.constructor.name);
      return discountStatus;
    } catch (error) {
      task.result = { message: error.message, stack: error.stack };
      task.status = ETaskStatus.FAILED;

      this.logger.error(`${inspect(error.stack)}`, this.constructor.name);
      throw error.stack;
    } finally {
      task.updatedAt = new Date();

      await this.taskModel.updateOne({ _id: task._id }, task).exec();
    }
  }

  // minute hour day month day-of-week
  @Cron('*/14 * * * *')
  async wakeUpRenderFreeTierServer(): Promise<boolean> {
    // Render spins down free tier servers after 15 minutes of inactivity
    this.logger.log(`wakeUpRenderFreeTierServer`, this.constructor.name);
    return true;
  }
}
