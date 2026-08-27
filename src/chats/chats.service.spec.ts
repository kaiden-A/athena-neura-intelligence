import { Test, TestingModule } from '@nestjs/testing';
import { ChatsService } from './chats.service';
import { NeonService } from 'src/neon/neon.service';

describe('ChatsService', () => {
  let service: ChatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatsService,
        { provide: NeonService, useValue: { pool: {} } },
      ],
    }).compile();

    service = module.get<ChatsService>(ChatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
