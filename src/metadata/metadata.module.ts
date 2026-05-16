import { Module } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { GoogleAiModule } from 'src/google-ai/google-ai.module';
import { IlmuchatModule } from 'src/ilmuchat/ilmuchat.module';

@Module({
  imports : [GoogleAiModule , IlmuchatModule],
  providers: [MetadataService],
  exports : [MetadataService]
})
export class MetadataModule {}
