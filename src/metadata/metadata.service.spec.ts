import { Test, TestingModule } from '@nestjs/testing';
import { MetadataService } from './metadata.service';
import { GoogleAiService } from 'src/google-ai/google-ai.service';
import { IlmuchatService } from 'src/ilmuchat/ilmuchat.service';

describe('MetadataService', () => {
  let service: MetadataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetadataService,
        { provide: GoogleAiService, useValue: { getLlm: jest.fn() } },
        { provide: IlmuchatService, useValue: { getLlm: jest.fn() } },
      ],
    }).compile();

    service = module.get<MetadataService>(MetadataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
