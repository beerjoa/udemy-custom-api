import { PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { User } from '#schemas';

export class LoginDto extends PickType(User, ['email', 'tid'] as const) {}

export class LoginResponseDto extends LoginDto {
  @IsString()
  access_token: string;
}
