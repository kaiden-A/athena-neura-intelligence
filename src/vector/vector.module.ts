import { Module } from '@nestjs/common';
import { VectorService } from './vector.service';
import { GoogleAiModule } from 'src/google-ai/google-ai.module';

@Module({
    imports : [GoogleAiModule],
    providers : [VectorService],
    exports : [VectorService]
})
export class VectorModule {}
