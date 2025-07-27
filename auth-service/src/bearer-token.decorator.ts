import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

export const BearerToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') || [];
    if (type !== 'Bearer') {
      throw new BadRequestException(
        'Invalid authorization header format. Expecting a Bearer Authorization',
      );
    }
    if (!token) {
      throw new BadRequestException(
        'No token provided in the authorization header.',
      );
    }
    return token;
  },
);