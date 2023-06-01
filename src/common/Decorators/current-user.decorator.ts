import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator for Current Logged in user
 */
export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
