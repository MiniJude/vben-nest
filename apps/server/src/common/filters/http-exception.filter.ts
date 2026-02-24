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
      let message = exception.message;
      if (
        exceptionResponse &&
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse
      ) {
        const responseMessage = (exceptionResponse as any).message;
        if (Array.isArray(responseMessage)) {
          message = responseMessage[0];
        } else if (typeof responseMessage === 'string') {
          message = responseMessage;
        }
      }
      response
        .status(status)
        .json(ApiResponse.error(message, exceptionResponse, StatusCode.ERROR));
      return;
    }

    response
      .status(status)
      .json(
        ApiResponse.error('Internal Server Error', exception, StatusCode.ERROR),
      );
  }
}
