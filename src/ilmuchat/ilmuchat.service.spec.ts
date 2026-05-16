import { Test, TestingModule } from '@nestjs/testing';
import { IlmuchatService } from './ilmuchat.service';

describe('IlmuchatService', () => {
  let service: IlmuchatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IlmuchatService],
    }).compile();

    service = module.get<IlmuchatService>(IlmuchatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
