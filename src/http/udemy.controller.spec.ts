import { Test, TestingModule } from '@nestjs/testing';

import { DiscountStatusResponseDto } from '#/http/dto/udemy.dto';
import { UdemyHttpService } from '#/http/udemy.service';
import { ETaskStatus } from '#/schemas';
import { UpdateTaskDto } from '#/tasks/dto/update-task.dto';

import { UdemyController } from '#http/udemy.controller';

describe('UdemyController', () => {
  let udemyController: UdemyController;
  let udemyHttpService: Partial<UdemyHttpService>;

  const discountStatusTaskDto: UpdateTaskDto = {
    title: 'checkDiscountStatus-timestamp',
    description: 'checking discount status from udemy api at 10/19/2023, 00:00:00 AM',
  };

  const discountStatusTask: DiscountStatusResponseDto = {
    ...discountStatusTaskDto,
    result: expect.any(Object),
    updatedAt: expect.any(Date),
  };

  beforeEach(async () => {
    udemyHttpService = {
      getDiscountStatusFromMongo: () => Promise.resolve(discountStatusTask),
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
  });
});
