import { Controller, Get, Query, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppService } from '#/app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get()
  getHello(): string {
    try {
      this.logger.log(`Hello World!`, this.constructor.name);
      this.logger.debug(`Hello World!`, this.constructor.name);
      this.logger.warn(`Hello World!`, this.constructor.name);
      // throw Error('Hello World!');
    } catch (error) {
      this.logger.error(error, error.stack, this.constructor.name);
    }
    return this.appService.getHello();
  }

  @Get('env')
  getEnv(@Query('name') subEnvName: string): unknown {
    return this.configService.get<object>(subEnvName);
  }
}
