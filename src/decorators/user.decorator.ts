import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';

export const User = createParamDecorator(
  (filter: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (request.user) {
      if (filter) {
        return request.user[filter];
      }
      return request.user;
    }
    throw new NotFoundException(
      'User not found in request. Use AuthGuard to get it',
    );
  },
);
