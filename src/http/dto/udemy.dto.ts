import { ApiProperty, PickType, PartialType } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, IsObject, IsUrl, ValidateNested } from 'class-validator';

import { IsCountryCode, IsCountryCodeOfUSRegion } from '#http/dto/validator';

import { Task } from '#schemas';

enum EInternalClass {
  Course = 'course',
  Locale = 'locale',
  User = 'user',
  CourseReview = 'course_review',
  PricingResult = 'pricing_result',
}

// https://www.udemy.com/developers/affiliate/models/course/
type TCourseVisibleInstructors = {
  _class: EInternalClass.User;
  title: string;
  name: string;
  display_name: string;
  job_title: string;
  image_50x50: string;
  image_100x100: string;
  initials: string;
  url: string;
};

type TCourseLocale = {
  _class: EInternalClass.Locale;
  locale: string;
  title: string;
  english_title: string;
  simple_english_title: string;
};

type TCourse = {
  _class: EInternalClass.Course;
  id: number;
  title: string;
  url: string;
  is_paid: boolean;
  price: string;
  price_detail: TPricingCoursesPrice;
  price_serve_tracking_id: string;
  visible_instructors: TCourseVisibleInstructors[];
  image_125_H: string;
  image_240x135: string;
  is_practice_test_course: boolean;
  image_480x270: string;
  published_title: string;
  tracking_id: string;
  locale: TCourseLocale;
  headline: string;
};

type TAggregationOption = {
  title: string;
  count: number;
  key: string;
  value: string;
};

type TAggregation = {
  title: string;
  key: string;
  options: TAggregationOption[];
};

export class CourseQueryDto {
  @ApiProperty({
    description: 'The page number of courses response',
  })
  @IsNumber()
  page: number;

  @ApiProperty({
    description: 'The page size of courses response',
    type: Number,
  })
  @IsNumber()
  page_size: number;

  @ApiProperty({
    description: 'The option about price',
    type: String,
  })
  price: 'price-paid' | 'price-free';
}

export class CourseResponseDto {
  @ApiProperty({
    description: 'The total number of courses',
    type: Number,
  })
  @IsNumber()
  count: number;

  @ApiProperty({
    description: 'The next page of courses',
    type: String,
  })
  @IsUrl()
  next: string;

  @ApiProperty({
    description: 'The previous page of courses',
    type: String,
  })
  @IsUrl()
  previous: string;

  @ApiProperty({
    description: 'The results of courses',
    type: Array,
  })
  @IsArray()
  results: TCourse[];

  @ApiProperty({
    description: 'The aggregations of courses',
    type: Array,
  })
  @IsArray()
  aggregations: TAggregation[];
}

type TPricingCoursesPrice = {
  amount: number;
  currency: string;
  price_string: string;
  currency_symbol: string;
};
type TPricingCourses = {
  _class: EInternalClass.PricingResult;
  price_server_tracking_id: string;
  price: TPricingCoursesPrice;
  list_price: TPricingCoursesPrice;
  discount_price: TPricingCoursesPrice;
  price_detail: TPricingCoursesPrice;
  saving_price: TPricingCoursesPrice;
  has_discount_saving: boolean;
  discount_percent: number;
  discount_percent_for_display: number;
  buyable: object;
  campaign: object;
  code: string;
  is_public: boolean;
};

export class PricingResponseDto {
  @ApiProperty({
    description: 'The pricing result of the courses from Udemy API',
    type: Object,
  })
  @IsObject()
  courses: Record<string, TPricingCourses>;

  @ApiProperty({
    description: 'The bundle result of the courses from Udemy API',
    type: Object,
  })
  @IsObject()
  bundle: any;
}

class TDiscountStatus {
  discountStatus: boolean;
}

class TaskDto extends PartialType(PickType(Task, ['title', 'description', 'updatedAt'] as const)) {}
@Exclude()
export class DiscountStatusResponseDto extends TaskDto {
  @ApiProperty({
    type: Boolean,
    description: 'The result of discount status',
    example: {
      discountStatus: true,
    },
  })
  @Expose()
  @IsObject()
  @Type(() => TDiscountStatus)
  @ValidateNested()
  result: TDiscountStatus;
}

export class DiscountStatusQueryDTO {
  @ApiProperty({
    type: String,
    description: 'Country Code (Alpha-2)',
    example: 'US',
  })
  @Transform(({ value }) => value.toUpperCase())
  @IsCountryCode({ message: 'Invalid country code' })
  // We only handle discount status for the US region for now.
  // it will be removed when we support other regions.
  @IsCountryCodeOfUSRegion({ message: 'Only US Country code allowed' })
  countryCode: string;
}
