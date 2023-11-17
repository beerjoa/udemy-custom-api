import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { UdemyHttpService } from '#http/udemy.service';
import { CreateTaskDto } from '#tasks/dto/create-task.dto';
import { UpdateTaskDto } from '#tasks/dto/update-task.dto';
import { TasksService } from '#tasks/tasks.service';

import { ETaskStatus, ETaskType, Task } from '#schemas';

describe('TasksService', () => {
  let taskService: TasksService;
  let taskModel: Model<Task>;

  const createTaskDto: CreateTaskDto = {
    title: 'test',
    description: 'test',
    status: ETaskStatus.OPEN,
    type: ETaskType.NONE,
  };

  const updateTaskDto: UpdateTaskDto = {
    title: 'test',
    description: 'test',
    status: ETaskStatus.DONE,
    type: ETaskType.NONE,
  };

  const createdTask = {
    _id: expect.any(String),
    ...createTaskDto,
    result: expect.any(Object),
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
    deletedAt: expect.any(null),
    __v: expect.any(Number),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken('Task'),
          useValue: {
            new: jest.fn().mockResolvedValue(createdTask),
            constructor: jest.fn().mockResolvedValue(createdTask),
            create: jest.fn().mockResolvedValue(createdTask),
            find: jest.fn().mockResolvedValue([createdTask]),
            findById: jest.fn().mockResolvedValue(createdTask),
            updateOne: jest.fn().mockResolvedValue(createdTask),
            findByIdAndDelete: jest.fn().mockResolvedValue(createdTask),
            exec: jest.fn(),
          },
        },
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: {
            debug: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: UdemyHttpService,
          useValue: {
            getDiscountStatusFromApi: jest.fn().mockResolvedValue(true),
            getCourseIdsFromApi: jest.fn().mockResolvedValue([1, 2, 3, 4, 5]),
          },
        },
      ],
    }).compile();

    taskService = module.get<TasksService>(TasksService);
    taskModel = module.get<Model<Task>>(getModelToken('Task'));
  });

  it('should be defined', () => {
    expect(taskService).toBeDefined();
  });

  describe('when create task', () => {
    it('should be defined', () => {
      expect(taskService.create).toBeDefined();
    });

    describe('and task is created successfully', () => {
      it('should return created task', async () => {
        expect(await taskService.create(createTaskDto)).toEqual(createdTask);
      });
    });
  });

  describe('when find all tasks', () => {
    it('should be defined', () => {
      expect(taskService.findAll).toBeDefined();
    });

    describe('and task is found', () => {
      beforeEach(() => {
        jest.spyOn(taskModel, 'find').mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce([createdTask]),
        } as any);
      });
      it('should return found tasks', async () => {
        expect(await taskService.findAll()).toEqual([createdTask]);
      });
    });
  });

  describe('when find one task', () => {
    it('should be defined', () => {
      expect(taskService.findOne).toBeDefined();
    });

    describe('and occur errors while finding one task', () => {
      beforeEach(() => {
        jest.spyOn(taskModel, 'findById').mockReturnValue({
          exec: jest.fn().mockReturnValueOnce(null),
        } as any);
      });
      it('should throw NotFoundException', () => {
        expect(taskService.findOne('1')).rejects.toThrow(NotFoundException);
      });
    });

    describe('and task is found', () => {
      beforeEach(() => {
        jest.spyOn(taskModel, 'findById').mockReturnValue({
          exec: jest.fn().mockReturnValueOnce(createdTask),
        } as any);
      });
      it('should return found task', async () => {
        expect(await taskService.findOne(createdTask._id)).toEqual(createdTask);
      });
    });
  });

  describe('when update task', () => {
    it('should be defined', () => {
      expect(taskService.update).toBeDefined();
    });

    describe('and occur errors while updating task', () => {
      beforeEach(() => {
        jest.spyOn(taskModel, 'findById').mockReturnValue({
          exec: jest.fn().mockReturnValueOnce(null),
        } as any);
      });
      it('should throw NotFoundException', () => {
        expect(taskService.update('1', updateTaskDto)).rejects.toThrow(NotFoundException);
      });
    });

    describe('and task is updated', () => {
      beforeEach(() => {
        jest.spyOn(taskModel, 'findById').mockReturnValue({
          exec: jest.fn().mockReturnValueOnce(createdTask),
        } as any);
        jest.spyOn(taskModel, 'updateOne').mockReturnValue({
          exec: jest.fn(),
        } as any);
      });
      it('should return updated task', async () => {
        expect(await taskService.update(createdTask._id, updateTaskDto)).toEqual({
          ...createdTask,
          ...updateTaskDto,
        });
      });
    });
  });
});
