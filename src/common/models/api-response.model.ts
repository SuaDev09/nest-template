export interface ApiResponse<T> {
  status: 'success' | 'error';
  statusCode?: number;
  message: string;
  data?: T;
  error?: string;
  timestamp?: Date;
  path?: string;
}

export function sendSucces<T>(
  code: number,
  data: T,
  message: string,
): ApiResponse<T> {
  return {
    status: 'success',
    statusCode: code,
    message,
    data,
    timestamp: new Date(),
  };
}

export function sendError(
  message: string,
  statusCode: number = 500,
): ApiResponse<null> {
  return {
    status: 'error',
    statusCode,
    message,
    timestamp: new Date(),
  };
}
