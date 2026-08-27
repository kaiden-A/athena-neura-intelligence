import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';

describe('TopicsController', () => {
  let controller: TopicsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      controllers: [TopicsController],
      providers: [
        {
          provide: TopicsService,
          useValue: { getAllTopics: jest.fn(), createTopic: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<TopicsController>(TopicsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
