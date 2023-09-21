import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

const jwtConfigAsync: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => ({
    secret: configService.get<string>('auth.jwt.accessSecret'),
    signOptions: { expiresIn: configService.get<string>('auth.jwt.accessExpirationTime') },
  }),
  inject: [ConfigService],
};

export default jwtConfigAsync;
