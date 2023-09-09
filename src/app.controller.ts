import { Controller, Get, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppService } from '#/app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('env')
  getEnv(@Query('name') subEnvName: string): unknown {
    return this.configService.get<object>(subEnvName);
  }
}
