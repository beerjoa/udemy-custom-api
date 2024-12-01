import { HttpModuleAsyncOptions, HttpModuleOptions } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const httpConfigAsync: HttpModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService): Promise<HttpModuleOptions> => {
    const encodedApiKey = Buffer.from(
      `${configService.get<string>('http.udemyClientId')}:${configService.get<string>('http.udemyClientSecret')}`,
    ).toString('base64');

    return {
      baseURL: configService.get<string>('http.baseURL'),
      timeout: configService.get<number>('http.timeout'),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${encodedApiKey}`,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Connection: 'keep-alive',
      },
    };
  },
  inject: [ConfigService],
};
