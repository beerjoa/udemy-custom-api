import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { AuthService } from '#auth/auth.service';
import { MESSAGE } from '#core/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwt.accessSecret'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const accessToken = req.headers.authorization.split(' ')[1];
    const isBlacklistUser = await this.authService.checkAccessTokenInBlacklist(accessToken);

    if (isBlacklistUser) {
      throw new UnauthorizedException(MESSAGE.AUTH.ERROR.INVALID_TOKEN);
    }

    return payload;
  }
}
