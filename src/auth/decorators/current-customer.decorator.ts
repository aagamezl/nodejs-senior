import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { JwtPayloadRefreshToken } from '../interfaces/jwt-payload-refresh-token';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayloadRefreshToken | undefined, context: ExecutionContext): JwtPayloadRefreshToken => {
    const ctx = GqlExecutionContext.create(context);

    const req = ctx.getContext().req;

    if (data) {
      return req.user[data]
    }

    return req.user;
  }
)
