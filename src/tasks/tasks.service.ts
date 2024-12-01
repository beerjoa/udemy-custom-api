import { inspect } from 'util';

import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { MESSAGE } from '#/core/constants';
import { ECountryCode } from '#/http/dto/udemy.dto';

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
    private readonly configService: ConfigService,
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
      throw new NotFoundException(MESSAGE.TASK.ERROR.NOT_FOUND_TASK.replace('#${task_id}', task_id));
    }

    return task;
  }

  async update(task_id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(task_id);

    Object.assign(task, updateTaskDto);
    task.updatedAt = new Date();

    await this.taskModel.updateOne({ _id: task_id }, task).exec();

    return task;
  }

  async remove(task_id: string): Promise<Task> {
    await this.findOne(task_id);

    return await this.taskModel.findByIdAndDelete(task_id).exec();
  }

  async checkDiscountStatusByCountry(countryCode: ECountryCode): Promise<boolean> {
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
      const discountPeriods = await this.udemyHttpService.checkDiscountStatusChange(countryCode, discountStatus);

      task.result = { discountStatus, countryCode, ...discountPeriods };
      task.status = ETaskStatus.DONE;

      this.logger.debug(`{ discountStatus: ${discountStatus}, countryCode: ${countryCode} } `, this.constructor.name);
      return discountStatus;
    } catch (error) {
      task.result = { message: error.message, stack: error.stack };
      task.status = ETaskStatus.FAILED;

      this.logger.error(`${inspect(error.stack)}`, this.constructor.name);
      return false;
    } finally {
      task.updatedAt = new Date();

      await this.taskModel.updateOne({ _id: task._id }, task).exec();
    }
  }

  // Schedule Job
  @Cron(CronExpression.EVERY_HOUR, {
    name: 'checkDiscountStatus',
    disabled: false,
  })
  async checkDiscountStatus(): Promise<void> {
    const countryCodes = [Object.values(ECountryCode)[1]];

    for (const countryCode of countryCodes) {
      await this.checkDiscountStatusByCountry(countryCode);
    }
  }

  async checkDiscountStatusWhenRestarted(): Promise<void> {
    const nodeEnv = this.configService.get<string>('common.nodeEnv');
    if (nodeEnv !== 'production') {
      this.logger.debug(`in development mode`, this.constructor.name);
      return;
    }

    const countryCodes = Object.values(ECountryCode);

    for (const countryCode of countryCodes) {
      await this.checkDiscountStatusByCountry(countryCode);
    }
  }

  // minute hour day month day-of-week
  @Cron('*/14 * * * *', {
    name: 'wakeUpRenderFreeTierServerForRender',
    disabled: true,
  })
  async wakeUpRenderFreeTierServer(): Promise<boolean> {
    // Render spins down free tier servers after 15 minutes of inactivity
    this.logger.log(`wakeUpRenderFreeTierServer`, this.constructor.name);
    return true;
  }
}
