import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SwaggerTheme } from 'swagger-themes';

import { AppModule } from '#/app.module';

import { MongooseExceptionFilter } from '#utils/mongoose-exception.filter';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const SWAGGER = configService.get('swagger');
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new MongooseExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle(SWAGGER.title)
    .setDescription(SWAGGER.description)
    .setVersion(SWAGGER.version)
    .setContact(SWAGGER.contact.name, SWAGGER.contact.url, SWAGGER.contact.email)
    .setLicense(SWAGGER.license.name, SWAGGER.license.url)
    .addServer(SWAGGER.server.url, SWAGGER.server.description)
    .addSecurity('access-token', { type: 'http', scheme: 'Bearer' })
    .addTag('auth', 'Operations about authentication')
    .addTag('tasks', 'Operations about scheduled tasks')
    .addTag('udemy', 'Operations about Udemy')
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, swaggerConfig);
  const theme = new SwaggerTheme('v3');
  const options: SwaggerCustomOptions = {
    explorer: false,
    customCss: theme.getBuffer('flattop'),
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  };
  SwaggerModule.setup('api-docs', app, document, options);

  app.enableCors();

  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
