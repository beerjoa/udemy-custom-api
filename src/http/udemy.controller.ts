import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { DiscountStatusQueryDTO, DiscountStatusResponseDto } from '#http/dto/udemy.dto';
import { UdemyHttpService } from '#http/udemy.service';

@Controller('udemy')
@ApiTags('udemy')
export class UdemyController {
  constructor(private readonly udemyHttpService: UdemyHttpService) {}

  @Get('discount-status')
  @HttpCode(200)
  @ApiOkResponse({ status: 200, description: 'Get discount status successfully', type: DiscountStatusResponseDto })
  @ApiNotFoundResponse({ status: 404, description: 'Not found' })
  async getDiscountStatus(@Query() discountStatusQuery: DiscountStatusQueryDTO): Promise<DiscountStatusResponseDto> {
    const { countryCode } = discountStatusQuery;
    return this.udemyHttpService.getDiscountStatusFromMongo(countryCode);
  }
}
