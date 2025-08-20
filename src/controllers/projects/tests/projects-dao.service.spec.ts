import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsDaoService } from '../projects.dao.service';

describe('ProjectsDaoService', () => {
  let service: ProjectsDaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectsDaoService],
    }).compile();

    service = module.get<ProjectsDaoService>(ProjectsDaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
