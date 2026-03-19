import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { VectorModule } from 'src/vector/vector.module';
import { GoogleAiModule } from 'src/google-ai/google-ai.module';

@Module({
  imports : [VectorModule , GoogleAiModule],
  providers: [QuestionsService],
  controllers: [QuestionsController]
})
export class QuestionsModule {}
