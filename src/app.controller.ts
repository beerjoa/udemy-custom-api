import { Controller, Get, Query, Inject, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeController } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppService } from '#/app.service';

@Controller()
@ApiExcludeController()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get()
  getHello(): string {
    try {
      const nodeEnv = this.configService.get<string>('common.nodeEnv');
      if (nodeEnv === 'development') {
        this.logger.log(`Hello World!`, this.constructor.name);
        this.logger.debug(`Hello World!`, this.constructor.name);
        this.logger.warn(`Hello World!`, this.constructor.name);
        // throw Error('Hello World!');
      }
    } catch (error) {
      this.logger.error(error, error.stack, this.constructor.name);
    }
    return this.appService.getHello();
  }

  @Get('env')
  getEnv(@Query('name') subEnvName: string): unknown {
    const nodeEnv = this.configService.get<string>('common.nodeEnv');
    if (nodeEnv === 'development') {
      return this.configService.get<object>(subEnvName);
    } else {
      throw new NotFoundException('Not Found');
    }
  }
}
