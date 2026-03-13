import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PullsModule } from './pulls/pulls.module';
import { QuestionsModule } from './questions/questions.module';
import { PrismaModule } from './prisma/prisma.module';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { AIGuard } from './ai/ai.guard';
import { VectorService } from './vector/vector.service';
import { VectorModule } from './vector/vector.module';
import { GoogleAiModule } from './google-ai/google-ai.module';

@Module({
  imports: [
    PullsModule, 
    QuestionsModule, 
    PrismaModule,
    MongooseModule.forRoot('mongodb://localhost:27017/motionu-rag'),
    VectorModule,
    GoogleAiModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide : APP_GUARD,
      useClass : AIGuard
    },
    AppService],
})
export class AppModule {}
