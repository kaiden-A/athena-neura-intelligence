import { Module } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';
import { NeonModule } from 'src/neon/neon.module';
import { TopicsRepository } from './topics.repository';

@Module({
  imports : [NeonModule],
  providers: [TopicsService , TopicsRepository],
  controllers: [TopicsController]
})
export class TopicsModule {}
