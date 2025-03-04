import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Cookie = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (!request.cookies) {
      console.warn('Cookies object is undefined in request');
      return null;
    }

    return key && key in request.cookies
      ? request.cookies[key]
      : key
        ? null
        : request.cookies;
  },
);
