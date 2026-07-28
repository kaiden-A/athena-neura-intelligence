import { Test, TestingModule } from '@nestjs/testing';
import { QaService } from './qa.service';
import { QaRepository } from './qa.respository';

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

      const result = await service.getQaById('1');
      expect(result).toEqual(record);
      expect(mockQaRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should return error when QA not found', async () => {
      mockQaRepository.findById.mockResolvedValue(null);

      const result = await service.getQaById('nonexistent');
      expect(result).toEqual({ status: 'error', message: 'QA record not found' });
    });
  });
});
