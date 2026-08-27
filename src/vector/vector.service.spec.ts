import { Test, TestingModule } from '@nestjs/testing';
import { VectorService } from './vector.service';
import { GoogleAiService } from 'src/google-ai/google-ai.service';
import { IlmuchatService } from 'src/ilmuchat/ilmuchat.service';
import { NeonService } from 'src/neon/neon.service';

describe('VectorService', () => {
  let service: VectorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VectorService,
        {
          provide: GoogleAiService,
          useValue: { getEmbeddingModel: jest.fn() },
        },
        { provide: IlmuchatService, useValue: {} },
        { provide: NeonService, useValue: { pool: {} } },
      ],
    }).compile();

    service = module.get<VectorService>(VectorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
