import { Module } from '@nestjs/common';
import { PullsService } from './pulls.service';
import { PullsController } from './pulls.controller';
import { VectorModule } from 'src/vector/vector.module';
import { AIGuard } from 'src/ai/ai.guard';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports : [
   VectorModule,
   PrismaModule 
  ],
  providers: [
    PullsService,
    AIGuard
  ],
  controllers: [PullsController]
})
export class PullsModule {}
