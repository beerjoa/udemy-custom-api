import { Controller, Post, UseGuards, Request, Get, Headers, HttpCode } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { AuthAccessToken, AuthUser } from '#auth/auth-user.decorator';
import { AuthService } from '#auth/auth.service';
import { LoginDto, LoginResponseDto } from '#auth/dto/login.dto';
import { UserPayloadDto } from '#auth/dto/verify.dto';
import { JwtAuthGuard, LocalAuthGuard } from '#auth/guard';

@Controller('auth')
@ApiTags('auth')
@ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto, description: 'Login payload' })
  @ApiOkResponse({ status: 200, description: 'Login successfully', type: LoginResponseDto })
  async login(@AuthUser() authUser: UserPayloadDto): Promise<LoginResponseDto> {
    return await this.authService.login(authUser);
  }

  @Post('verify')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ status: 200, description: 'Verify successfully', type: UserPayloadDto })
  getJwtAuth(@AuthUser() authUser: UserPayloadDto): UserPayloadDto {
    return authUser;
  }

  @Get('logout')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ status: 200, description: 'Logout successfully', type: UserPayloadDto })
  async logout(
    @AuthUser()
    authUser: UserPayloadDto,
    @AuthAccessToken() accessToken: string,
  ): Promise<UserPayloadDto> {
    return await this.authService.logout(authUser, accessToken);
  }
}
