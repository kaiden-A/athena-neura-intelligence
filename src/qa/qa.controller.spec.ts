import { Test, TestingModule } from '@nestjs/testing';
import { QaController } from './qa.controller';
import { QaService } from './qa.service';

describe('QaController', () => {
  let controller: QaController;

  const mockQaService = {
    getQaById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QaController],
      providers: [{ provide: QaService, useValue: mockQaService }],
    }).compile();

    controller = module.get<QaController>(QaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getQaById', () => {
    it('should call service with correct id', async () => {
      const record = { id: '1', question: 'test' };
      mockQaService.getQaById.mockResolvedValue(record);

      const result = await controller.getQaById('1');
      expect(result).toEqual(record);
      expect(mockQaService.getQaById).toHaveBeenCalledWith('1');
    });
  });
});
