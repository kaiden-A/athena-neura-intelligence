import { Test, TestingModule } from '@nestjs/testing';
import { PullsService } from './pulls.service';
import { VectorService } from 'src/vector/vector.service';

describe('PullsService', () => {
  let service: PullsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PullsService, { provide: VectorService, useValue: {} }],
    }).compile();

    service = module.get<PullsService>(PullsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
