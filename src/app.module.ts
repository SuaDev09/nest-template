// NEST
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

// config
import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';

// moudle
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './controllers/projects/projects.module';
// Middelewares
import { LoggerMiddleware } from '@config/middleware/LoggerMiddleware.middleware';

// Controllers

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `env/.env.${process.env.NODE_ENV || 'dev'}`, // Carga el archivo según NODE_ENV
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),
    ,
    ProjectsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
