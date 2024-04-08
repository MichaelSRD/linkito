import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('Acortador de link')
  .setDescription('The links API description')
  .setVersion('1.0')
  .addBearerAuth()
  .addTag('linkito')
  .build();
   const document = SwaggerModule.createDocument(app, config);
   SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  app.enableCors();
  await app.listen(Number(process.env.PORT) || 3000);
}
bootstrap();
