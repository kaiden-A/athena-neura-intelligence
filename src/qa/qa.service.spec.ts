import { Test, TestingModule } from '@nestjs/testing';
import { QaService } from './qa.service';
import { QaRepository } from './qa.respository';
import { MetadataService } from 'src/metadata/metadata.service';
import { VectorService } from 'src/vector/vector.service';
import { TopicsService } from 'src/topics/topics.service';

describe('QaService', () => {
  let service: QaService;

  const mockQaRepository = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QaService,
        { provide: QaRepository, useValue: mockQaRepository },
        { provide: MetadataService, useValue: { generateMetadata: jest.fn() } },
        { provide: VectorService, useValue: {} },
        { provide: TopicsService, useValue: { findTopicById: jest.fn() } },
      ],
    }).compile();

    service = module.get<QaService>(QaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getQaById', () => {
    it('should return a QA record when found', async () => {
      const record = { id: '1', question: 'test', answer: 'test' };
      mockQaRepository.findById.mockResolvedValue(record);

      const result: unknown = await service.getQaById('1');
      expect(result).toEqual(record);
      expect(mockQaRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should return error when QA not found', async () => {
      mockQaRepository.findById.mockResolvedValue(null);

      const result: unknown = await service.getQaById('nonexistent');
      expect(result).toEqual({
        status: 'error',
        message: 'QA record not found',
      });
    });
  });
});
