import { registerAs } from '@nestjs/config';

const _FormattingServerDescription = () => {
  const nodeEnv = process.env.NODE_ENV;
  const firstLetter = nodeEnv.charAt(0).toUpperCase();
  const restLetter = nodeEnv.slice(1).toLowerCase();

  return `${firstLetter}${restLetter}`;
};

export const swaggerConfig = registerAs('swagger', () => ({
  server: {
    url: process.env.APP_URL,
    description: _FormattingServerDescription(),
  },
  title: `${process.env.APP_NAME} API`,
  description: `
  ---
  <br>
  _<u>As this is a beta version, it may be subject to change at any time.</u>_
  
  **Welcome to the CUdemy API,** designed to provide additional information not available in the official API.
  
  You can get <code>access-token</code> with a valid **Email** and **TID** from this service.  
  The access token is used only for authentication and task management.  
  However, the APIs listed below can be accessed without <code>access-token</code>.
  - <code>[GET /api/udemy/*](#operations-tag-udemy)</code>
  
  <br>
  
  ---
  `,
  version: '0.5.0',
  contact: {
    name: 'Beerjoa',
    url: 'https://blog.beerjoa.dev/',
    email: 'hello@beerjoa.dev',
  },
  license: {
    name: 'MIT License',
    url: 'https://github.com/beerjoa/udemy-custom-api/blob/main/LICENSE.md',
  },
}));
