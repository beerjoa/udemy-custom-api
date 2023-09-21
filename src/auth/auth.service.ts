import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { LoginResponseDto } from '#auth/dto/login.dto';
import { UserPayloadDto } from '#auth/dto/verify.dto';

import { User, Blacklist } from '#schemas';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Blacklist.name) private readonly tokenBlacklistModel: Model<Blacklist>,
    private readonly jwtService: JwtService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}
  async login(user: User): Promise<LoginResponseDto> {
    const payload = { email: user.email, tid: user.tid };

    return {
      ...payload,
      access_token: this.jwtService.sign(payload),
    } as LoginResponseDto;
  }

  async checkAccessTokenInBlacklist(accessToken: string): Promise<boolean> {
    const blacklistedToken = await this.tokenBlacklistModel.findOne({ access_token: accessToken }).exec();

    return !!blacklistedToken;
  }

  async logout(user: UserPayloadDto, accessToken: string): Promise<UserPayloadDto> {
    this.logger.debug(`${JSON.stringify(user)}`, this.constructor.name);
    await this.tokenBlacklistModel.create({
      access_token: accessToken,
      description: `logout user ${user.email}`,
      expires_at: user.exp * 1000,
      issued_at: user.iat * 1000,
    });
    return user;
  }

  // Schedule
  @Cron(CronExpression.EVERY_5_MINUTES)
  async removeExpiredToken(): Promise<void> {
    const now = new Date();

    // hard delete
    await this.tokenBlacklistModel.deleteMany({ expires_at: { $lte: now } }).exec();
  }
}
