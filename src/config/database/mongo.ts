import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModuleAsyncOptions, MongooseModuleOptions } from '@nestjs/mongoose';

// --- Mongo ---
export const mongoConfigAsync: MongooseModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService): Promise<MongooseModuleOptions> => ({
    uri: configService.get<string>('database.mongo.uri'),
    dbName: configService.get<string>('database.mongo.database'),
  }),
  inject: [ConfigService],
};

export default mongoConfigAsync;
