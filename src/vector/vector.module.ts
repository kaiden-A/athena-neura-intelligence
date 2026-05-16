import { Module } from '@nestjs/common';
import { VectorService } from './vector.service';
import { GoogleAiModule } from 'src/google-ai/google-ai.module';
import { NeonModule } from 'src/neon/neon.module';
import { IlmuchatModule } from 'src/ilmuchat/ilmuchat.module';

@Module({
    imports : [GoogleAiModule , NeonModule, IlmuchatModule],
    providers : [VectorService],
    exports : [VectorService]
})
export class VectorModule {}
