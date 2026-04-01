import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { VectorModule } from 'src/vector/vector.module';
import { GoogleAiModule } from 'src/google-ai/google-ai.module';
import { ChatsModule } from 'src/chats/chats.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { AIGuard } from 'src/ai/ai.guard';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports : [VectorModule , GoogleAiModule , ChatsModule , PrismaModule],
  providers: [QuestionsService , AIGuard],
  controllers: [QuestionsController]
})
export class QuestionsModule {}
