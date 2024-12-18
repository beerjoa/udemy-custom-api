import { registerAs } from '@nestjs/config';

export const commonConfig = registerAs('common', () => ({
  nodeEnv: process.env.NODE_ENV,
  appName: process.env.APP_NAME,
  host: process.env.HOST,
  port: parseInt(process.env.PORT, 10) || 3000,
}));

export const httpConfig = registerAs('http', () => ({
  baseURL: process.env.API_URL,
  timeout: parseInt(process.env.API_TIMEOUT, 10) || 5000,
  udemyClientId: process.env.API_CLIENT_ID,
  udemyClientSecret: process.env.API_CLIENT_SECRET,
}));

export const authConfig = registerAs('auth', () => ({
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET_KEY || 'secret',
    accessExpirationTime: process.env.JWT_ACCESS_EXPIRATION_TIME || '60s',
  },
}));
