import { registerAs } from '@nestjs/config';

const commonConfig = registerAs('common', () => ({
  nodeEnv: process.env.NODE_ENV,
  appName: process.env.APP_NAME,
  host: process.env.HOST,
  port: parseInt(process.env.PORT, 10) || 3000,
}));

export default commonConfig;
