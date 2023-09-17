import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule } from 'nest-winston';

import { AppController } from '#/app.controller';
import { AppService } from '#/app.service';

import commonConfig, { httpConfig } from '#core/common.config';
import mongoConfigAsync from '#core/database/mongo';
import databaseConfig from '#core/database.config';
import winstonConfigAsync from '#core/logger.config';
import { TasksModule } from '#tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [commonConfig, databaseConfig, httpConfig],
    }),
    WinstonModule.forRootAsync(winstonConfigAsync),
    MongooseModule.forRootAsync(mongoConfigAsync),
    ScheduleModule.forRoot(),
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
