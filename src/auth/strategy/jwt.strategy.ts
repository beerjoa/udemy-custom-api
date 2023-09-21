import { inspect } from 'node:util';

import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { AuthService } from '#auth/auth.service';

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
      throw new UnauthorizedException('Invalid token');
    }

    return payload;
  }
}
