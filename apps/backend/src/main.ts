import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' }); // Adjust path as necessary, assuming .env is in the project root

import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Required for Better Auth
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalInterceptors(new LoggingInterceptor());
  // app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.CORS_ORIGIN || ['http://localhost:3001'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });
  const port = process.env.BACKEND_PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
