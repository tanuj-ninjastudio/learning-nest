import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;

    if (exception instanceof HttpException) {
      // ✅ Get HTTP status code
      status = exception.getStatus();

      // ✅ Narrow type of getResponse()
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const msgField = (exceptionResponse as { message?: string | string[] })
          .message;
        message = Array.isArray(msgField)
          ? msgField.join(', ')
          : msgField || 'An error occurred';
      } else {
        message = 'An error occurred';
      }
    } else {
      // ✅ Unknown or unexpected error
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      console.error(exception); // log for debugging
    }

    // ✅ Send consistent JSON response
    response.status(status).json({
      status,
      message,
      data: null,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
