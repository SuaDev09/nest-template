import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import * as morgan from 'morgan';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: any, res: any, next: () => void) {
    morgan(
      process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test'
        ? 'common'
        : 'dev',
      {
        stream: {
          write: (message) => this.logger.log(message),
        },
      },
    )(req, res, next);
  }
}
