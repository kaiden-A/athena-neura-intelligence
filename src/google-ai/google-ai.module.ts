import { Module } from '@nestjs/common';
import { GoogleAiService } from './google-ai.service';

@Module({
  providers: [GoogleAiService]
})
export class GoogleAiModule {}
