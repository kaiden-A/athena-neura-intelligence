import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return the health payload', () => {
      expect(appController.getHello()).toEqual({
        message: 'RAG API SERVICE IS WORKING!',
        athena: 'HII How Are You!!',
        neura: 'Where Have You Been?',
      });
    });
  });
});
