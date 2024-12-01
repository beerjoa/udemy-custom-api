import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { UsersService } from '#auth/users.service';
import { MESSAGE } from '#core/constants';

import { User } from '#schemas';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly usersService: UsersService) {
    super({ usernameField: 'email', passwordField: 'tid' });
  }
  async validate(email: string, tid: string): Promise<User> {
    const user = await this.usersService.findByTidAndEmail(tid, email);

    if (!user) {
      throw new UnauthorizedException();
    }

    // tid validation
    const tidValid = true;

    if (!tidValid) {
      throw new UnauthorizedException(MESSAGE.AUTH.ERROR.INVALID_CREDENTIALS);
    }

    return user;
  }
}
