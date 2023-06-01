import { Module, Provider, ValidationPipe } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ResponseInterceptor } from './interceptors';
import { HttpExceptionFilter, MongoExceptionFilter } from './filters';

/**
 * Response interceptor for all valid response.
 * NOTE: this interceptor defines in the global contex
 */
const ResponseInterceptorProvider: Provider = {
  provide: APP_INTERCEPTOR,
  useClass: ResponseInterceptor,
};

/**
 * Exception filter for HttpExceptions
 */
const ExceptionFilterProvider: Provider = {
  provide: APP_FILTER,
  useClass: HttpExceptionFilter,
};
/**
 * Exception filter for MongoDB Error
 */
const MongoDBExceptionFilterProvider: Provider = {
  provide: APP_FILTER,
  useClass: MongoExceptionFilter,
};

/**
 * Validation pipe to class-validator
 */
const GlobalValidationPipe: Provider = {
  provide: APP_PIPE,
  useValue: new ValidationPipe({ transform: true, forbidUnknownValues: true }),
};

@Module({
  providers: [
    ResponseInterceptorProvider,
    ExceptionFilterProvider,
    GlobalValidationPipe,
    // MongoDBExceptionFilterProvider,
  ],
})
export class CommonModule {}
