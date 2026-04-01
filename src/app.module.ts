import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PullsModule } from './pulls/pulls.module';
import { QuestionsModule } from './questions/questions.module';
import { PrismaModule } from './prisma/prisma.module';
import {ConfigModule} from '@nestjs/config';
import { VectorModule } from './vector/vector.module';
import { GoogleAiModule } from './google-ai/google-ai.module';
import { ChatsModule } from './chats/chats.module';
import { NeonModule } from './neon/neon.module';
import { QaModule } from './qa/qa.module';
import { MetadataModule } from './metadata/metadata.module';
import { TopicsModule } from './topics/topics.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal : true}),
    PullsModule, 
    QuestionsModule, 
    PrismaModule,
    VectorModule,
    GoogleAiModule,
    ChatsModule,
    NeonModule,
    QaModule,
    MetadataModule,
    TopicsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService],
})
export class AppModule {}
