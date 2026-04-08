import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const origins = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3001'];
  app.enableCors({
    origin: origins,
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
