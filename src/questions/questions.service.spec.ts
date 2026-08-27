import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from './questions.service';
import { VectorService } from 'src/vector/vector.service';
import { GoogleAiService } from 'src/google-ai/google-ai.service';
import { ChatsService } from 'src/chats/chats.service';
import { IlmuchatService } from 'src/ilmuchat/ilmuchat.service';

describe('QuestionsService', () => {
  let service: QuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        { provide: VectorService, useValue: { hybridSearch: jest.fn() } },
        { provide: GoogleAiService, useValue: {} },
        { provide: ChatsService, useValue: {} },
        { provide: IlmuchatService, useValue: {} },
      ],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
