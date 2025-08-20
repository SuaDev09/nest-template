import { Module } from '@nestjs/common';
import { ProjectsDaoService } from './projects.dao.service';
import { MSSqlModule } from '@/config/mssql/mssql.module';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { UsersModule } from '../users/users.module';
import { StatusTransitionService } from '@/common/services/status-transition.service';

@Module({
  imports: [MSSqlModule, UsersModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsDaoService, StatusTransitionService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
