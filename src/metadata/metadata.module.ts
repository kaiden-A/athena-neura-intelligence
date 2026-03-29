import { Module } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { GoogleAiModule } from 'src/google-ai/google-ai.module';

@Module({
  imports : [GoogleAiModule],
  providers: [MetadataService],
  exports : [MetadataService]
})
export class MetadataModule {}
