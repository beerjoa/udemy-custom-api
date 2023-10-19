import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

import { LoginDto } from '#auth/dto/login.dto';

export class UserPayloadDto extends LoginDto {
  @IsNumber()
  @ApiProperty({ type: Number, description: 'issued at', example: 1620000000 })
  iat: number;

  @IsNumber()
  @ApiProperty({ type: Number, description: 'expiration time', example: Date.now() })
  exp: number;
}
