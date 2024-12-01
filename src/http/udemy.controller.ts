import { Controller, Get, HttpCode, NotFoundException, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

import { MESSAGE } from '#/core/constants';

import { DiscountStatusQueryDto, DiscountStatusResponseDto } from '#http/dto/udemy.dto';
import { UdemyHttpService } from '#http/udemy.service';

@Controller('udemy')
@ApiTags('udemy')
export class UdemyController {
  constructor(private readonly udemyHttpService: UdemyHttpService) {}

  @Get('discount-status')
  @HttpCode(200)
  @ApiOkResponse({ status: 200, description: 'Get discount status successfully', type: DiscountStatusResponseDto })
  @ApiNotFoundResponse({ status: 404, description: 'Not found' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
  @ApiOperation({
    summary: 'Get discount status',
    description:
      'It returns the discount status of a specific region by Country Codes Alpha-2, such as US, KR, JP, etc.',
    operationId: 'getDiscountStatus',
  })
  async getDiscountStatus(
    @Query() discountStatusQuery: DiscountStatusQueryDto,
  ): Promise<DiscountStatusResponseDto | DiscountStatusResponseDto[]> {
    try {
      const { countryCode } = discountStatusQuery;
      let result;

      if (countryCode === undefined) {
        result = await this.udemyHttpService.getDiscountStatusOfEveryCountryFromMongo();
      } else {
        result = await this.udemyHttpService.getDiscountStatusFromMongo(countryCode);
      }

      const transformedResult = plainToInstance(DiscountStatusResponseDto, result);
      await validateOrReject(transformedResult);

      return transformedResult;
    } catch (error) {
      throw new NotFoundException(MESSAGE.UDEMY.ERROR.NOT_FOUND_DISCOUNT_STATUS);
    }
  }
}
