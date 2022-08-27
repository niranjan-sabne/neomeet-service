import {
  ValidationPipe,
  VersioningType,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('NeoMEET-SERVICE')
    .setDescription('NeoMEET API Service Portal')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
    prefix: 'api/v',
  });

  app.enableCors();

  await app.listen(process.env.PORT || 6969);
}
bootstrap();
