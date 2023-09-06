import { registerAs } from '@nestjs/config';

const commonConfig = registerAs('common', () => ({
  nodeEnv: process.env.NODE_ENV,
  host: process.env.HOST,
  port: parseInt(process.env.PORT, 10) || 3000,
}));

export default commonConfig;
