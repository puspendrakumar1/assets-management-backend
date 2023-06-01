import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const permissions = user.permissions || [];

    return roles.some((role) =>
      permissions.some((permission: string) => permission === role),
    );
  }
}
