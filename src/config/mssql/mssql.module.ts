import { Module } from '@nestjs/common';
import { MSSqlService } from './mssql.service';
import { DAOExecutor } from './executor.dao.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [MSSqlService, DAOExecutor],
  exports: [MSSqlService, DAOExecutor],
  imports: [ConfigModule],
})
export class MSSqlModule {}
