import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';

import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const error = exception.getError();

    let status = 500;
    let message = 'Unexpected error';

    // Si es un objeto con status y message
    if (
      typeof error === 'object' &&
      'status' in error &&
      'message' in error
    ) {
      status = +error.status! || 500;
      message = error.message as string;
    } else if (typeof error === 'string') {
      message = error;
    }

    return response.status(status).json({ status, message });
  }
}