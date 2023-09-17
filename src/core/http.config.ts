import { HttpModuleAsyncOptions, HttpModuleOptions } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

const httpConfigAsync: HttpModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService): Promise<HttpModuleOptions> => ({
    baseURL: configService.get<string>('http.baseURL'),
    timeout: configService.get<number>('http.timeout'),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${configService.get<string>('http.udemyApiKey')}`,
    },
  }),
  inject: [ConfigService],
};

export default httpConfigAsync;
