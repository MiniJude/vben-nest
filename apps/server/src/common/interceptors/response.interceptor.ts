import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { isRawResponse } from '../decorators/public.decorator';
import { ApiResponse } from '../dto/response.dto';

function isApiResponse(data: any): data is ApiResponse<any> {
  return (
    data &&
    typeof data === 'object' &&
    'code' in data &&
    'message' in data &&
    'data' in data
  );
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    if (
      isRawResponse(context.getHandler()) ||
      isRawResponse(context.getClass())
    ) {
      return next.handle() as any;
    }
    return next.handle().pipe(
      map((data) => {
        if (isApiResponse(data)) {
          return data;
        }
        return ApiResponse.success(data ?? null);
      }),
    );
  }
}
