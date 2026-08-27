import { Reflector } from '@nestjs/core';
import { AIGuard } from './ai.guard';
import { PrismaService } from 'src/prisma/prisma.service';

describe('AIGuard', () => {
  it('should be defined', () => {
    const prisma = {} as unknown as PrismaService;
    expect(new AIGuard(prisma, new Reflector())).toBeDefined();
  });
});
