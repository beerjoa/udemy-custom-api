import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { catchError, firstValueFrom } from 'rxjs';

import { CourseQueryDto, CourseResponseDto, PricingResponseDto } from '#http/dto/udemy.dto';

@Injectable()
export class UdemyHttpService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly httpService: HttpService,
  ) {}

  async getDiscountStatusFromApi(course_ids: number[]): Promise<boolean> {
    const { data } = await firstValueFrom(
      this.httpService.get<PricingResponseDto>('/pricing', { params: { course_ids: course_ids.join(',') } }).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error, this.constructor.name);
          throw error;
        }),
      ),
    );

    const courses = Object.values(data.courses);

    return courses.every((course) => course.has_discount_saving);
  }
  async getCourseIdsFromApi(): Promise<number[]> {
    const params: CourseQueryDto = {
      page_size: 5,
      page: 1,
      price: 'price-paid',
    };

    const { data } = await firstValueFrom(
      this.httpService.get<CourseResponseDto>('/courses', { params }).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error, this.constructor.name);
          throw error;
        }),
      ),
    );

    return data.results.map((course) => course.id);
  }
}
