import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationError } from 'class-validator';

/**
 * Exception handler
 * handles thrown http exception
 * constructs valid response
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * Catch ongoing HttpException and transform
   * @param {HttpException} exception
   * @param {ArgumentsHost} host
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let message = exception['response'].message || exception.message;

    if (Array.isArray(message) && message[0] instanceof ValidationError) {
      message = this.retrieveValidationErrorMessage(message[0]);
    }
    if (typeof message === 'string') {
      message = message.charAt(0).toUpperCase() + message.slice(1);
    }

    response.status(exception.getStatus()).json({
      isError: true,
      message,
      exception: {
        errorCode: exception['response']['error'],
        statusCode: exception['response']['statusCode'],
      },
    });
  }

  /**
   * Featch first valid error message from class validator error
   * @param {ValidationError} err
   * @returns {string}
   */
  retrieveValidationErrorMessage(err: ValidationError): string {
    const foundedErrorMessage = this.retrieveMessageFromConstraints(
      err.constraints,
    );
    if (foundedErrorMessage) {
      return foundedErrorMessage;
    }
    if (err.children && err.children.length) {
      return this.retrieveValidationErrorMessage(err.children[0]);
    }
  }

  /**
   * Retrieve error message from given object
   * @param {{ [key: string]: string }} constraints
   * @returns {string}
   */
  retrieveMessageFromConstraints(constraints: {
    [key: string]: string;
  }): string {
    if (constraints) {
      return Object.keys(constraints).map((key) => constraints[key])[0];
    }
    return '';
  }
}
