import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PullsModule } from './pulls/pulls.module';
import { QuestionsModule } from './questions/questions.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { AIGuard } from './ai/ai.guard';
import {ConfigModule} from '@nestjs/config';
import { VectorModule } from './vector/vector.module';
import { GoogleAiModule } from './google-ai/google-ai.module';
import { ChatsModule } from './chats/chats.module';
import { NeonModule } from './neon/neon.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal : true}),
    PullsModule, 
    QuestionsModule, 
    PrismaModule,
    VectorModule,
    GoogleAiModule,
    ChatsModule,
    NeonModule
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
