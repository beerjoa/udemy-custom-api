import { ApiProperty, PickType, PartialType } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

import { IsCountryCode, IsCountryCodeOfUSRegion } from '#http/dto/validator';

import { Task } from '#schemas';

enum EInternalClass {
  Course = 'course',
  Locale = 'locale',
  User = 'user',
  CourseReview = 'course_review',
  PricingResult = 'pricing_result',
}

/**
 * @description The country code (Alpha-2) for Udemy API
 * @enum {string}
 * @readonly
 */
export enum ECountryCode {
  US = 'US',
  CA = 'CA',
  KR = 'KR',
  IN = 'IN',
}

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
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiProperty({
    description: 'The page size of courses response',
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  page_size: number;

  @ApiProperty({
    description: 'The option about price',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  price: 'price-paid' | 'price-free';

  @ApiProperty({
    description: 'The search keyword',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  search: string;
}

export class PricingQueryDto {
  @ApiProperty({
    description: 'The course ids of pricing response',
    type: String,
    required: true,
  })
  @IsString()
  course_ids: string;

  @ApiProperty({
    description: 'The Fields of pricing response',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  'fields[pricing_result]': string;
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

export class TDiscountStatus {
  @ApiProperty({
    type: Boolean,
    description: 'Discount Status',
    example: true,
  })
  @IsBoolean()
  discountStatus: boolean;

  @ApiProperty({
    enum: ECountryCode,
    description: 'Country Code (Alpha-2)',
    example: ECountryCode.US,
  })
  @IsEnum(ECountryCode)
  @IsOptional()
  countryCode: ECountryCode;

  @ApiProperty({
    type: Date,
    description: 'Discount Started At',
    example: new Date(),
  })
  @IsDate()
  @IsOptional()
  startedAt: Date;

  @ApiProperty({
    type: Date,
    description: 'Discount Ended At',
    example: new Date(),
  })
  @IsDate()
  @IsOptional()
  endedAt: Date;
}

class TaskDto extends PartialType(PickType(Task, ['title', 'description', 'updatedAt'] as const)) {}
@Exclude()
export class DiscountStatusResponseDto extends TaskDto {
  @ApiProperty({
    type: TDiscountStatus,
    description: 'The result of discount status',
  })
  @Expose()
  @IsObject()
  @Type(() => TDiscountStatus)
  @ValidateNested()
  result: TDiscountStatus;
}

export class DiscountStatusQueryDto {
  @ApiProperty({
    enum: ECountryCode,
    description: 'Country Code (Alpha-2)',
    example: ECountryCode.US,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value.toUpperCase())
  @IsCountryCode({ message: 'Invalid country code' })
  // We only handle discount status for the US region for now.
  // it will be removed when we support other regions.
  @IsCountryCodeOfUSRegion({ message: 'Only US Country code allowed' })
  countryCode: string;
}
