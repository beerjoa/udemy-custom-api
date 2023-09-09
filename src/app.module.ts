import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from '#/app.controller';
import { AppService } from '#/app.service';
import commonConfig from '#config/common.config';
import databaseConfig from '#config/database.config';
import mongoConfigAsync from '#config/database/mongo';
import { TasksModule } from '#tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [commonConfig, databaseConfig],
    }),
    MongooseModule.forRootAsync(mongoConfigAsync),
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
