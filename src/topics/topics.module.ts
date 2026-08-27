import { Module } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';
import { NeonModule } from 'src/neon/neon.module';
import { TopicsRepository } from './topics.repository';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [NeonModule],
  providers: [TopicsService, TopicsRepository, AuthGuard],
  controllers: [TopicsController],
  exports: [TopicsService],
})
export class TopicsModule {}
