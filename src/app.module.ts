import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule } from 'nest-winston';

import { AppController } from '#/app.controller';
import { AppService } from '#/app.service';

import { AuthModule } from '#auth/auth.module';
import { swaggerConfig, winstonConfigAsync, databaseConfig, commonConfig, authConfig, httpConfig } from '#core/config';
import mongoConfigAsync from '#core/database/mongo';
import { TasksModule } from '#tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [commonConfig, databaseConfig, httpConfig, authConfig, swaggerConfig],
    }),
    WinstonModule.forRootAsync(winstonConfigAsync),
    MongooseModule.forRootAsync(mongoConfigAsync),
    ScheduleModule.forRoot(),
    TasksModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
