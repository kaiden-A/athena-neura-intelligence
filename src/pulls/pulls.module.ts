import { Module } from '@nestjs/common';
import { PullsService } from './pulls.service';
import { PullsController } from './pulls.controller';
import { VectorModule } from 'src/vector/vector.module';

@Module({
  imports : [
   VectorModule 
  ],
  providers: [
    PullsService
  ],
  controllers: [PullsController]
})
export class PullsModule {}
