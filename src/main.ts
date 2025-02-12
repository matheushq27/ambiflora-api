import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Env } from './env';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService<Env, true>>(ConfigService);
  const port = configService.get('PORT', { infer: true });
  app.useGlobalPipes(new ValidationPipe())
  app.enableShutdownHooks()

  const config = new DocumentBuilder()
    .addSecurity('Bearer', {
      type: 'http',
      scheme: 'Bearer',
    })
    .setTitle('Ambiflora')
    .setDescription('Ambiflora API')
    .setVersion('1.0')
    .addTag('authenticate')
    .addTag('companies')
    .addTag('users')
    .addTag('customers')
    .addTag('anmProcesses')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    }
  });

  app.enableCors();
  await app.listen(port);
}
bootstrap();
