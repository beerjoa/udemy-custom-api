import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Task } from '#schemas/task.schema';
import { CreateTaskDto } from '#tasks/dto/create-task.dto';
import { UpdateTaskDto } from '#tasks/dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

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
