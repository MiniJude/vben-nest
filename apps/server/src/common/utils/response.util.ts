import { HttpException, HttpStatus } from '@nestjs/common';

import { ApiResponse, PaginatedResponse } from '../dto/response.dto';

export function successResponse<T>(
  data: T,
  message: string = 'ok',
): ApiResponse<T> {
  return ApiResponse.success(data, message);
}

export function errorResponse(
  message: string,
  error: any = null,
  code: number = -1,
): ApiResponse<null> {
  return ApiResponse.error(message, error, code);
}

export function forbiddenResponse(
  message: string = 'Username or password is incorrect.',
): void {
  throw new HttpException(
    errorResponse(message, message),
    HttpStatus.FORBIDDEN,
  );
}

export function paginatedResponse<T>(
  items: T[],
  total: number,
  message: string = 'ok',
): ApiResponse<PaginatedResponse<T>> {
  return ApiResponse.success(new PaginatedResponse(items, total), message);
}

export function paginate<T>(page: number, pageSize: number, array: T[]): T[] {
  const offset = (page - 1) * pageSize;
  return offset + pageSize >= array.length
    ? array.slice(offset)
    : array.slice(offset, offset + pageSize);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
