import { Controller, Post, UseGuards, Request, Get, Headers } from '@nestjs/common';

import { AuthAccessToken, AuthUser } from '#auth/auth-user.decorator';
import { AuthService } from '#auth/auth.service';
import { LoginResponseDto } from '#auth/dto/login.dto';
import { UserPayloadDto } from '#auth/dto/verify.dto';
import { JwtAuthGuard, LocalAuthGuard } from '#auth/guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@AuthUser() authUser: UserPayloadDto): Promise<LoginResponseDto> {
    return await this.authService.login(authUser);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  getJwtAuth(@AuthUser() authUser: UserPayloadDto): UserPayloadDto {
    return authUser;
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(
    @AuthUser()
    authUser: UserPayloadDto,
    @AuthAccessToken() accessToken: string,
  ): Promise<UserPayloadDto> {
    return await this.authService.logout(authUser, accessToken);
  }
}
