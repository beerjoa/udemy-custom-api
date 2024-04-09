import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosError } from 'axios';
import { Model } from 'mongoose';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { catchError, firstValueFrom } from 'rxjs';

import {
  ECountryCode,
  CourseQueryDto,
  CourseResponseDto,
  PricingResponseDto,
  DiscountStatusResponseDto,
  TDiscountStatus,
} from '#http/dto/udemy.dto';

import { ETaskType, Task } from '#schemas';

@Injectable()
export class UdemyHttpService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private readonly httpService: HttpService,
  ) {}

  private getCountryHeader(countryCode: ECountryCode): Record<string, string> {
    return {
      'X-Udemy-Cache-Brand': `${countryCode}en_US`,
      'X-Udemy-Cache-Language': 'en',
      'X-Udemy-Cache-Marketplace-Country': `${countryCode}`,
      'X-Udemy-Cache-Price-Country': `${countryCode}`,
    };
  }

  async getDiscountStatusFromApi(countryCode: ECountryCode, courseIds: number[]): Promise<boolean> {
    const headers = this.getCountryHeader(countryCode);
    const { data } = await firstValueFrom(
      this.httpService
        .get<PricingResponseDto>('/pricing/', { params: { course_ids: courseIds.join(',') }, headers })
        .pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
    );

    const courses = Object.values(data.courses);
    this.logger.debug(`courses: ${courses.map((course) => course.has_discount_saving)}`, this.constructor.name);

    const discountCoursesCount = courses.filter((course) => course.has_discount_saving).length;
    return discountCoursesCount >= Math.floor(courses.length / 2);
  }
  async getCourseIdsFromApi(countryCode: ECountryCode): Promise<number[]> {
    const headers = this.getCountryHeader(countryCode);
    const params: CourseQueryDto = {
      page_size: 10,
      page: 1,
      price: 'price-paid',
    };

    const { data } = await firstValueFrom(
      this.httpService.get<CourseResponseDto>('/courses/', { params, headers }).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error, this.constructor.name);
          throw error;
        }),
      ),
    );

    if (Array.isArray(data.results) && data.results.length === 0) throw new NotFoundException('No courses found');

    return data.results.map((course) => course.id);
  }

  async checkDiscountStatusChange(
    countryCode: ECountryCode,
    currentStatus: boolean,
  ): Promise<Partial<TDiscountStatus>> {
    const discountsPeriods: Partial<TDiscountStatus> = {
      startedAt: null,
      endedAt: null,
    };

    const task = await this.taskModel
      .findOne(
        {
          type: ETaskType.CHECK_DISCOUNT_STATUS,
          'result.discountStatus': { $exists: true, $ne: null },
          'result.countryCode': countryCode,
        },
        {},
        { sort: { updatedAt: -1 } },
      )
      .exec();

    const previousStatus = task as DiscountStatusResponseDto;
    const isChangedStatus = !!((currentStatus ? 1 : 0) ^ (previousStatus.result.discountStatus ? 1 : 0));

    if (isChangedStatus) {
      const dateAt = new Date();
      if (currentStatus && !previousStatus.result.discountStatus) {
        discountsPeriods.startedAt = dateAt;
      } else if (!currentStatus && previousStatus.result.discountStatus) {
        discountsPeriods.startedAt = previousStatus.result.startedAt;
        discountsPeriods.endedAt = dateAt;
      }
    } else {
      // if (currentStatus && previousStatus.result.discountStatus) {
      discountsPeriods.startedAt = previousStatus.result.startedAt;
      discountsPeriods.endedAt = previousStatus.result.endedAt;
      // }
    }
    this.logger.debug(`discountsPeriods: ${JSON.stringify(discountsPeriods)}`, this.constructor.name);
    return discountsPeriods;
  }

  async getDiscountStatusFromMongo(countryCode: string): Promise<Task> {
    try {
      const task = await this.taskModel
        .findOne(
          { 'result.discountStatus': { $exists: true, $ne: null }, 'result.countryCode': countryCode },
          {},
          { sort: { updatedAt: -1 } },
        )
        .exec();

      if (!task) {
        throw new NotFoundException(`Not found, Discount Status`);
      }

      return task;
    } catch (error) {
      this.logger.error(error, this.constructor.name);
      throw new NotFoundException(`Not found, Discount Status`);
    }
  }
  async getDiscountStatusOfEveryCountryFromMongo(): Promise<Task[]> {
    try {
      const tasks = await this.taskModel.aggregate([
        {
          $match: {
            'result.countryCode': { $exists: true, $ne: null },
            'result.discountStatus': { $exists: true, $ne: null },
            'result.startedAt': { $exists: true },
            'result.endedAt': { $exists: true },
          },
        },
        { $sort: { updatedAt: -1, 'result.countryCode': -1 } },
        {
          $group: {
            _id: '$result.countryCode',
            title: { $first: '$title' },
            description: { $first: '$description' },
            updatedAt: { $first: '$updatedAt' },
            result: {
              $first: {
                discountStatus: '$result.discountStatus',
                startedAt: '$result.startedAt',
                endedAt: '$result.endedAt',
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            title: 1,
            description: 1,
            updatedAt: 1,
            result: {
              countryCode: '$_id',
              discountStatus: 1,
              startedAt: 1,
              endedAt: 1,
            },
          },
        },
      ]);

      if (!tasks) {
        throw new NotFoundException(`Not found, Discount Status`);
      }

      return tasks;
    } catch (error) {
      this.logger.error(error, this.constructor.name);
      throw new NotFoundException(`Not found, Discount Status`);
    }
  }
}
