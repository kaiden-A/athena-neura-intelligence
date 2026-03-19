import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { NeonModule } from 'src/neon/neon.module';

@Module({
  imports : [NeonModule],
  providers: [ChatsService],
  exports : [ChatsService]
})
export class ChatsModule {}
