import { Test, TestingModule } from '@nestjs/testing';
import { PullsController } from './pulls.controller';
import { PullsService } from './pulls.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('PullsController', () => {
  let controller: PullsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PullsController],
      providers: [
        { provide: PullsService, useValue: { pullFromNotion: jest.fn() } },
        PrismaService,
      ],
    }).compile();

    controller = module.get<PullsController>(PullsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
