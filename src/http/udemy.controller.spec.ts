import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import * as classTransformer from 'class-transformer';

import { DiscountStatusResponseDto } from '#http/dto/udemy.dto';
import { UdemyController } from '#http/udemy.controller';
import { UdemyHttpService } from '#http/udemy.service';
import { UpdateTaskDto } from '#tasks/dto/update-task.dto';

import { ETaskStatus, Task } from '#schemas';

describe('UdemyController', () => {
  let udemyController: UdemyController;
  let udemyHttpService: Partial<UdemyHttpService>;

  const discountStatusTaskDto: UpdateTaskDto = {
    title: 'checkDiscountStatus-timestamp',
    description: 'checking discount status from udemy api at 10/19/2023, 00:00:00 AM',
  };

  const DiscountStatusQueryDto = {
    countryCode: 'US',
  };

  const discountStatusTask: Task = {
    _id: expect.any(String),
    ...discountStatusTaskDto,
    status: ETaskStatus.DONE,
    result: {
      discountStatus: true,
      startedAt: expect.any(Date),
      endedAt: expect.any(Date),
    },
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
    deletedAt: null,
    __v: expect.any(Number),
  } as Task;

  beforeEach(async () => {
    udemyHttpService = {
      getDiscountStatusFromMongo: () => Promise.resolve(discountStatusTask),
      getDiscountStatusOfEveryCountryFromMongo: () => Promise.resolve([discountStatusTask]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UdemyController],
      providers: [{ provide: UdemyHttpService, useValue: udemyHttpService }],
    }).compile();

    udemyController = module.get<UdemyController>(UdemyController);
  });

  it('should be defined', () => {
    expect(udemyController).toBeDefined();
  });

  describe('when get discount status', () => {
    it('should be defined', () => {
      expect(udemyController.getDiscountStatus).toBeDefined();
    });

    describe('and occur error while getting discount status', () => {
      it('should throw NotFoundException', () => {
        udemyHttpService.getDiscountStatusFromMongo = () => Promise.reject(new NotFoundException());

        expect(udemyController.getDiscountStatus(DiscountStatusQueryDto)).rejects.toThrow(NotFoundException);
      });
    });

    describe('and get discount status successfully', () => {
      it('should return discount status for specific country', async () => {
        jest.spyOn(classTransformer, 'plainToInstance').mockReturnValue(discountStatusTask);
        expect(await udemyController.getDiscountStatus(DiscountStatusQueryDto)).toEqual(discountStatusTask);
      });

      it('should return discount status for every country', async () => {
        jest.spyOn(classTransformer, 'plainToInstance').mockReturnValue([discountStatusTask]);
        const DiscountStatusQueryDto = { countryCode: undefined };
        expect(await udemyController.getDiscountStatus(DiscountStatusQueryDto)).toEqual([discountStatusTask]);
      });
    });
  });
});
