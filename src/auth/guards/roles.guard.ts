import { GqlExecutionContext } from '@nestjs/graphql';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext().req;
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(ROLES_KEY, context.getHandler());
    
    if (!roles) {
      return true;
    }

    const request = this.getRequest(context);
    const user = request.user;
    
    return matchRoles(roles, user.role);
  }
}

const matchRoles = (roles: string[], userRole: string): boolean => {
  return roles.some(role => role === userRole);
}
