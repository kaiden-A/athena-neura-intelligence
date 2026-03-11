import { Module } from '@nestjs/common';
import { PullsService } from './pulls.service';
import { PullsController } from './pulls.controller';

@Module({
  providers: [PullsService],
  controllers: [PullsController]
})
export class PullsModule {}
