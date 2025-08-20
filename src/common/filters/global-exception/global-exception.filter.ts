import {
  HttpException,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
} from '@nestjs/common';
import { sendError } from '@/common/models/api-response.model';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    // Create a formatted error response using the sendError function
    const errorResponse = sendError(exception.message, status);

    // Add additional metadata to the response
    errorResponse.timestamp = new Date();
    errorResponse.path = request.url;

    // Check if the response is a Fastify response
    if (typeof response.code === 'function') {
      response.code(status).send(errorResponse);
    } else {
      // Fallback for other platforms (e.g., Express)
      response.status(status).json(errorResponse);
    }
  }
}
