import { PickType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';

import { User } from '#schemas';

export class UserPayloadDto extends PickType(User, ['email', 'tid'] as const) {
  @IsNumber()
  iat: number;

  @IsNumber()
  exp: number;
}
