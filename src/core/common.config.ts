import { registerAs } from '@nestjs/config';

const commonConfig = registerAs('common', () => ({
  nodeEnv: process.env.NODE_ENV,
  appName: process.env.APP_NAME,
  host: process.env.HOST,
  port: parseInt(process.env.PORT, 10) || 3000,
}));

export const httpConfig = registerAs('http', () => ({
  baseURL: process.env.API_URL,
  timeout: parseInt(process.env.API_TIMEOUT, 10) || 5000,
  udemyApiKey: process.env.API_KEY || 'API_KEY',
}));

export default commonConfig;
