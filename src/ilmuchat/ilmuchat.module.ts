import { Module } from '@nestjs/common';
import { IlmuchatService } from './ilmuchat.service';

@Module({
  providers: [IlmuchatService],
  exports : [IlmuchatService]
})
export class IlmuchatModule {}
