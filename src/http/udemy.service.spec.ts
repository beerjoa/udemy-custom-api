import { HttpService } from '@nestjs/axios';
import { PickType } from '@nestjs/mapped-types';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { of } from 'rxjs';

import { CourseResponseDto, CourseQueryDto } from '#http/dto/udemy.dto';
import { UdemyHttpService } from '#http/udemy.service';

describe('UdemyHttpService', () => {
  let udemyHttpService: UdemyHttpService;
  let httpService: HttpService;

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
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    udemyHttpService = module.get<UdemyHttpService>(UdemyHttpService);
    httpService = module.get<HttpService>(HttpService);
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
        jest.spyOn(httpService, 'get').mockReturnValueOnce(of(mockResponse));
        courseResponse.results.map = jest.fn().mockReturnValueOnce([expect.any(Number)]);
      });
      it('should return course ids', async () => {
        expect(await udemyHttpService.getCourseIdsFromApi()).toMatchObject([expect.any(Number)]);
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
        await expect(udemyHttpService.getCourseIdsFromApi()).rejects.toThrowError('No courses found');
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
        expect(await udemyHttpService.getDiscountStatusFromApi([expect.any(Number)])).toBeTruthy();
      });
    });

    describe('and the udemy api returns no discount status', () => {});
  });
});
