import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosError } from 'axios';
import { plainToClass } from 'class-transformer';
import { Model } from 'mongoose';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { catchError, firstValueFrom } from 'rxjs';

import { CourseQueryDto, CourseResponseDto, PricingResponseDto, DiscountStatusResponseDto } from '#http/dto/udemy.dto';

import { Task } from '#schemas';

@Injectable()
export class UdemyHttpService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private readonly httpService: HttpService,
  ) {}

  private getCountryHeader(countryCode: string): Record<string, string> {
    return {
      'X-Udemy-Cache-Brand': `${countryCode}en_US`,
      'X-Udemy-Cache-Language': 'en',
      'X-Udemy-Cache-Marketplace-Country': `${countryCode}`,
      'X-Udemy-Cache-Price-Country': `${countryCode}`,
    };
  }

  async getDiscountStatusFromApi(countryCode: string, courseIds: number[]): Promise<boolean> {
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
    return discountCoursesCount > Math.floor(courses.length / 2);
  }
  async getCourseIdsFromApi(countryCode: string): Promise<number[]> {
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

  async getDiscountStatusFromMongo(): Promise<DiscountStatusResponseDto> {
    const task = await this.taskModel
      .findOne(
        { 'result.discountStatus': { $exists: true, $ne: null } },
        {},
        {
          sort: {
            updatedAt: -1,
          },
        },
      )
      .exec();

    if (!task) {
      throw new NotFoundException(`Not found, Discount Status`);
    }

    const discountStatus = plainToClass(DiscountStatusResponseDto, task.toObject());

    return discountStatus;
  }
}
