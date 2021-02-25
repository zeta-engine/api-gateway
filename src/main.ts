import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './commons/filters/http-exception.filter';
import { LoggingInterceptor } from './commons/interceptors/logging.interceptor';
import { TimeoutInterceptor } from './commons/interceptors/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(), new TimeoutInterceptor());

  await app.listen(8080);
}
bootstrap();
