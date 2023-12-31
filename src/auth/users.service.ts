import { inspect } from 'node:util';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Timeout } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { User } from '#schemas';

@Injectable()
export class UsersService {
  private TID = 'dummy-tid';
  private EMAIL = 'test@test.com';

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  async findByTidAndEmail(tid: string = this.TID, email: string = this.EMAIL): Promise<User> {
    const user = await this.userModel.findOne({ tid, email }).exec();
    this.logger.debug(`${inspect(user)}`, this.constructor.name);

    return user;
  }

  // Schedule Job
  @Timeout('createDummyUser', 5000)
  async createDummyUser(): Promise<User> {
    const nodeEnv = this.configService.get<string>('common.nodeEnv');
    if (nodeEnv === 'production') {
      this.logger.log(`in production mode`, this.constructor.name);
      return;
    }
    const userDto = {
      tid: this.TID,
      email: this.EMAIL,
    };

    const user = await this.findByTidAndEmail(userDto.tid, userDto.email);

    if (user) {
      return user;
    }

    const createdUser = await this.userModel.create(userDto);
    this.logger.debug(`${inspect(createdUser)}`, this.constructor.name);
    return createdUser;
  }
}
