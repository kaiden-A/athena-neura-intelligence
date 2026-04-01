import { Module } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';
import { NeonModule } from 'src/neon/neon.module';
import { TopicsRepository } from './topics.repository';
import { AuthGuard } from 'src/auth/auth.guard';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports : [NeonModule , JwtModule],
  providers: [
    TopicsService , 
    TopicsRepository,
    AuthGuard
  ],
  controllers: [TopicsController]
})
export class TopicsModule {}
