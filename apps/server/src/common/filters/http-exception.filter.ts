import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { ApiResponse, StatusCode } from '../dto/response.dto';

function isApiResponse(data: any): data is ApiResponse<any> {
  return (
    data &&
    typeof data === 'object' &&
    'code' in data &&
    'message' in data &&
    'data' in data
  );
}

function toErrorMessage(exceptionResponse: any, fallback: string): string {
  if (typeof exceptionResponse === 'string' && exceptionResponse) {
    return exceptionResponse;
  }
  const message = exceptionResponse?.message;
  if (typeof message === 'string' && message) {
    return message;
  }
  if (Array.isArray(message) && typeof message[0] === 'string' && message[0]) {
    return message[0];
  }
  return fallback;
}

function toErrorDetail(exceptionResponse: any, fallback: string): string {
  if (typeof exceptionResponse === 'string' && exceptionResponse) {
    return exceptionResponse;
  }
  const error = exceptionResponse?.error;
  if (typeof error === 'string' && error) {
    return error;
  }
  return fallback;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      if (isApiResponse(exceptionResponse)) {
        response.status(status).json(exceptionResponse);
        return;
      }
      const message = toErrorMessage(exceptionResponse, exception.message);
      const error = toErrorDetail(exceptionResponse, message);
      response
        .status(status)
        .json(ApiResponse.error(message, error, StatusCode.ERROR));
      return;
    }

    response
      .status(status)
      .json(
        ApiResponse.error(
          'Internal Server Error',
          'Internal Server Error',
          StatusCode.ERROR,
        ),
      );
  }
}
