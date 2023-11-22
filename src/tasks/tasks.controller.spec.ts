import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateTaskDto } from '#tasks/dto/create-task.dto';
import { UpdateTaskDto } from '#tasks/dto/update-task.dto';
import { TasksController } from '#tasks/tasks.controller';
import { TasksService } from '#tasks/tasks.service';

import { ETaskStatus, ETaskType, Task } from '#schemas';

describe('TasksController', () => {
  let taskController: TasksController;
  let taskService: Partial<TasksService>;

  const createTaskDto: CreateTaskDto = {
    title: 'test',
    description: 'test',
    status: ETaskStatus.OPEN,
    type: ETaskType.NONE,
    result: { test: 'test' },
  };

  const updateTaskDto: UpdateTaskDto = {
    title: 'test2',
    description: 'test2',
    status: ETaskStatus.DONE,
    type: ETaskType.NONE,
    result: { test: 'updated test' },
  };

  const createdTask: Task = {
    _id: expect.any(String),
    ...createTaskDto,
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
    deletedAt: expect.any(null),
    __v: expect.any(Number),
  };

  beforeEach(async () => {
    taskService = {
      create: () => Promise.resolve(createdTask),
      findAll: () => Promise.resolve([createdTask]),
      findOne: () => Promise.resolve(createdTask),
      update: () => Promise.resolve(createdTask),
      remove: () => Promise.resolve(createdTask),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: taskService }],
    }).compile();

    taskController = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(taskController).toBeDefined();
  });

  describe('when create task', () => {
    it('should be defined', () => {
      expect(taskController.create).toBeDefined();
    });

    describe('and create task is successful', () => {
      it('should return created task', async () => {
        expect(await taskController.create(createTaskDto)).toEqual(createdTask);
      });
    });
  });

  describe('when find all tasks', () => {
    it('should be defined', () => {
      expect(taskController.findAll).toBeDefined();
    });

    describe('and find all tasks is successful', () => {
      it('should return all tasks', async () => {
        expect(await taskController.findAll()).toEqual([createdTask]);
      });
    });
  });

  describe('when find one task by id', () => {
    it('should be defined', () => {
      expect(taskController.findOne).toBeDefined();
    });

    describe('and occur errors while finding one task', () => {
      it('should throw NotFoundException', () => {
        taskService.findOne = () => Promise.reject(new NotFoundException());

        expect(taskController.findOne('1')).rejects.toThrow(NotFoundException);
      });
    });

    describe('and find one task is successful', () => {
      it('should return one task', async () => {
        expect(await taskController.findOne('1')).toEqual(createdTask);
      });
    });
  });

  describe('when update task by id', () => {
    it('should be defined', () => {
      expect(taskController.update).toBeDefined();
    });

    describe('and occur errors while updating task', () => {
      it('should throw NotFoundException', () => {
        taskService.update = () => Promise.reject(new NotFoundException());

        expect(taskController.update('1', updateTaskDto)).rejects.toThrow(NotFoundException);
      });
    });

    describe('and update task is successful', () => {
      it('should return updated task', async () => {
        expect(await taskController.update('1', updateTaskDto)).toMatchObject({
          ...updateTaskDto,
          ...createdTask,
        });
      });
    });
  });

  describe('when remove task by id', () => {
    it('should be defined', () => {
      expect(taskController.remove).toBeDefined();
    });

    describe('and occur errors while removing task', () => {
      it('should throw NotFoundException', () => {
        taskService.remove = () => Promise.reject(new NotFoundException());

        expect(taskController.remove('1')).rejects.toThrow(NotFoundException);
      });
    });

    describe('and remove task is successful', () => {
      it('should return removed task', async () => {
        expect(await taskController.remove('1')).toEqual(createdTask);
      });
    });
  });
});
