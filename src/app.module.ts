// NEST
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

// moudle
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './controllers/projects/projects.module';
// Middelewares
import { LoggerMiddleware } from '@config/middleware/LoggerMiddleware.middleware';

// Controllers

@Module({
  imports: [ConfigModule.forRoot(), ProjectsModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
