import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Response interface
 * @interface Response
 * @template T
 */
interface Response<T> {
  isError: boolean;
  message?: string;
  data?: T;
}

/**
 * Intercept every successfuly resonse
 * @export
 * @class ResponseInterceptor
 * @implements {NestInterceptor<T, Response<T>>}
 * @template T
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  /**
   * Intercept response and modify
   * @param {ExecutionContext} context
   * @param {CallHandler} next
   * @returns {Observable<Response<T>>}
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(map((data) => ({ isError: false, ...data })));
  }
}
