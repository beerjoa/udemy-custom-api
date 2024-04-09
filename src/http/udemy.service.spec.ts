import { HttpService } from '@nestjs/axios';
import { NotFoundException } from '@nestjs/common';
import { PickType } from '@nestjs/mapped-types';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { Model } from 'mongoose';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { of } from 'rxjs';

import { CourseResponseDto, CourseQueryDto, DiscountStatusResponseDto, ECountryCode } from '#http/dto/udemy.dto';
import { UdemyHttpService } from '#http/udemy.service';
import { UpdateTaskDto } from '#tasks/dto/update-task.dto';

import { ETaskStatus, ETaskType, Task } from '#schemas';

describe('UdemyHttpService', () => {
  let udemyHttpService: UdemyHttpService;
  let httpService: HttpService;
  let taskModel: Model<Task>;

  const countryCode = ECountryCode.US;
  const courseQueryDto: CourseQueryDto = {
    page_size: expect.any(Number),
    page: expect.any(Number),
    price: expect.any(PickType(CourseQueryDto, ['price'])),
  };
  const courseResponse: CourseResponseDto = {
    count: expect.any(Number),
    next: expect.any(String),
    previous: expect.any(String),
    results: expect.any(PickType(CourseResponseDto, ['results'])),
    aggregations: expect.any(PickType(CourseResponseDto, ['aggregations'])),
  };

  const discountStatusTaskDto: UpdateTaskDto = {
    title: 'checkDiscountStatus-timestamp',
    description: 'checking discount status from udemy api at 10/19/2023, 00:00:00 AM',
    status: ETaskStatus.DONE,
    type: ETaskType.CHECK_DISCOUNT_STATUS,
    result: {
      discountStatus: true,
      startedAt: expect.any(Date),
      endedAt: expect.any(Date),
    },
  };

  const discountStatusTask: Task = {
    _id: expect.any(String),
    title: 'checkDiscountStatus-timestamp',
    description: 'checking discount status from udemy api at 10/19/2023, 00:00:00 AM',
    status: ETaskStatus.DONE,
    type: ETaskType.CHECK_DISCOUNT_STATUS,
    result: {
      discountStatus: true,
      startedAt: expect.any(Date),
      endedAt: expect.any(Date),
    },
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
    deletedAt: expect.any(null),
    __v: expect.any(Number),
  };

  let mockResponse: AxiosResponse = null;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UdemyHttpService,
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: {
            debug: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: getModelToken('Task'),
          useValue: {
            findOne: jest.fn(),
            exec: jest.fn().mockResolvedValue(null),
            aggregate: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    udemyHttpService = module.get<UdemyHttpService>(UdemyHttpService);
    httpService = module.get<HttpService>(HttpService);
    taskModel = module.get<Model<Task>>(getModelToken('Task'));
  });

  it('should be defined', () => {
    expect(udemyHttpService).toBeDefined();
  });

  describe('when getting the course ids from udemy api', () => {
    it('should be defined', () => {
      expect(udemyHttpService.getCourseIdsFromApi).toBeDefined();
    });

    describe('and the udemy api returns course ids', () => {
      beforeEach(() => {
        mockResponse = {
          status: 200,
          statusText: '',
          headers: expect.any(Object),
          config: expect.any(Object),
          data: courseResponse,
        };
        jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));
        courseResponse.results.map = jest.fn().mockReturnValue([expect.any(Number)]);
      });
      it('should return course ids', async () => {
        expect(await udemyHttpService.getCourseIdsFromApi(countryCode)).toMatchObject([expect.any(Number)]);
      });
    });

    describe('and the udemy api returns empty courses', () => {
      beforeEach(() => {
        mockResponse = {
          status: 200,
          statusText: '',
          headers: expect.any(Object),
          config: expect.any(Object),
          data: { ...courseResponse, results: [] },
        };
        jest.spyOn(httpService, 'get').mockReturnValueOnce(of(mockResponse));
      });
      it('should throw NotFoundException', async () => {
        await expect(udemyHttpService.getCourseIdsFromApi(countryCode)).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when getting the discount status from udemy api', () => {
    it('should be defined', () => {
      expect(udemyHttpService.getDiscountStatusFromApi).toBeDefined();
    });

    describe('and the udemy api returns discount status', () => {
      beforeEach(() => {
        mockResponse = {
          status: 200,
          statusText: '',
          headers: expect.any(Object),
          config: expect.any(Object),
          data: {
            courses: {
              1: {
                has_discount_saving: true,
              },
              2: {
                has_discount_saving: true,
              },
              3: {
                has_discount_saving: true,
              },
              4: {
                has_discount_saving: true,
              },
              5: {
                has_discount_saving: true,
              },
            },
          },
        };
        jest.spyOn(httpService, 'get').mockReturnValueOnce(of(mockResponse));
      });
      it('should return true', async () => {
        expect(await udemyHttpService.getDiscountStatusFromApi(countryCode, [expect.any(Number)])).toBeTruthy();
      });
    });

    describe('and the udemy api returns no discount status', () => {});
  });

  describe('when getting the discount status from mongo db', () => {
    it('should be defined', () => {
      expect(udemyHttpService.getDiscountStatusFromMongo).toBeDefined();
      expect(udemyHttpService.checkDiscountStatusChange).toBeDefined();
    });

    describe('and occur errors while getting discount status from mongo db', () => {
      beforeEach(() => {
        jest.spyOn(taskModel, 'findOne').mockReturnValue({
          exec: jest.fn().mockReturnValueOnce(null),
        } as any);
      });
      it('should throw NotFoundException', async () => {
        await expect(udemyHttpService.getDiscountStatusFromMongo(countryCode)).rejects.toThrow(NotFoundException);
      });
    });

    describe('and the mongo db returns discount status', () => {
      beforeEach(() => {
        jest.spyOn(taskModel, 'findOne').mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(discountStatusTask),
        } as any);
        jest.spyOn(taskModel, 'aggregate').mockResolvedValueOnce([discountStatusTask]);
      });
      it('should return discount status for specific country', async () => {
        expect(await udemyHttpService.getDiscountStatusFromMongo(countryCode)).toMatchObject({
          result: {
            discountStatus: true,
            startedAt: expect.any(Date),
            endedAt: expect.any(Date),
          },
        });
      });
      it('should return discount status for every country', async () => {
        expect(await udemyHttpService.getDiscountStatusOfEveryCountryFromMongo()).toEqual([discountStatusTask]);
      });
    });

    describe('and checking discount status is changed', () => {
      beforeEach(() => {
        jest.spyOn(taskModel, 'findOne').mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce({
            ...discountStatusTask,
            result: {
              discountStatus: true,
              startedAt: expect.any(Date),
              endedAt: expect.any(Date),
            },
          }),
        } as any);
      });
      it('should return previous discount period', async () => {
        expect(await udemyHttpService.checkDiscountStatusChange(countryCode, true)).toEqual({
          startedAt: expect.any(Date),
          endedAt: expect.any(Date),
        });
      });
    });
  });
});
