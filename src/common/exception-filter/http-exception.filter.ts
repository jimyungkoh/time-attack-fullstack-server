import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const statusCode = exception.getStatus();
    const res = exception.getResponse() as any;

    response.status(statusCode).json({
      success: false,
      result: null,
      error: { message: res.message },
    });
  }
}
