import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PullsModule } from './pulls/pulls.module';
import { QuestionsModule } from './questions/questions.module';
import { PrismaModule } from './prisma/prisma.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    PullsModule, 
    QuestionsModule, 
    PrismaModule,
    MongooseModule.forRoot('mongodb://localhost:27017/motionu-rag')
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
