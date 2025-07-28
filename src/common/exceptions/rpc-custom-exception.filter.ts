import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rpcError = exception.getError();

    if (
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      const status = Number(rpcError.status);

      if (!Number.isInteger(status) || status < 100 || status > 599) {
        // Status inválido, forzamos 500
        return response.status(500).json({
          status: 500,
          message: rpcError.message || 'Internal Server Error',
        });
      }

      return response.status(status).json(rpcError);
    }

    // Caso default para otros errores
    response.status(400).json({
      status: 400,
      message: typeof rpcError === 'string' ? rpcError : 'Bad Request',
    });
  }
}
