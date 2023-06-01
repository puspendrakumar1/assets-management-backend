import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { MongoError, MongoServerError } from 'mongodb';
import { Response } from 'express';

@Catch(MongoServerError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.BAD_REQUEST).json({ isError: true });
  }
}
