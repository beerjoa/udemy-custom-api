import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';

import { AppController } from '#/app.controller';
import { AppService } from '#/app.service';

import commonConfig from '#config/common.config';
import mongoConfigAsync from '#config/database/mongo';
import databaseConfig from '#config/database.config';
import winstonConfigAsync from '#config/logger.config';
import { TasksModule } from '#tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [commonConfig, databaseConfig],
    }),
    WinstonModule.forRootAsync(winstonConfigAsync),
    MongooseModule.forRootAsync(mongoConfigAsync),
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
