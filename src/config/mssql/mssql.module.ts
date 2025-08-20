import { Module } from '@nestjs/common';
import { MSSqlService } from './mssql.service';
import { DAOExecutor } from './executor.dao.service';

@Module({
  providers: [MSSqlService, DAOExecutor],
  exports: [MSSqlService, DAOExecutor],
})
export class MSSqlModule {}
