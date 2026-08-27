import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { IlmuchatService } from './ilmuchat.service';

describe('IlmuchatService', () => {
  let service: IlmuchatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      providers: [IlmuchatService],
    }).compile();

    service = module.get<IlmuchatService>(IlmuchatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
