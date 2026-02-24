export enum StatusCode {
  ERROR = -1,
  SUCCESS = 0,
}

export class ApiResponse<T = any> {
  code: number;
  data: T;
  error: any;
  message: string;

  constructor(
    data: T,
    message: string = 'ok',
    code: number = StatusCode.SUCCESS,
    error: any = null,
  ) {
    this.code = code;
    this.data = data;
    this.error = error;
    this.message = message;
  }

  static error(
    message: string,
    error: any = null,
    code: number = StatusCode.ERROR,
  ): ApiResponse<null> {
    return new ApiResponse(null, message, code, error);
  }

  static success<T>(data: T, message: string = 'ok'): ApiResponse<T> {
    return new ApiResponse(data, message, StatusCode.SUCCESS, null);
  }
}

export class PaginatedResponse<T = any> {
  items: T[];
  total: number;

  constructor(items: T[], total: number) {
    this.items = items;
    this.total = total;
  }
}
