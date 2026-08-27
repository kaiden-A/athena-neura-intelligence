import { Test, TestingModule } from '@nestjs/testing';
import { TopicsService } from './topics.service';
import { TopicsRepository } from './topics.repository';

describe('TopicsService', () => {
  let service: TopicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicsService,
        {
          provide: TopicsRepository,
          useValue: {
            create: jest.fn(),
            getAll: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TopicsService>(TopicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
