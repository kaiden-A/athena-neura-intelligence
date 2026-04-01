import { Module } from '@nestjs/common';
import { QaService } from './qa.service';
import { QaController } from './qa.controller';
import { MetadataModule } from 'src/metadata/metadata.module';
import { QaRepository } from './qa.respository';
import { NeonModule } from 'src/neon/neon.module';

@Module({
  imports : [MetadataModule , NeonModule],
  providers: [
    QaService , 
    QaRepository
  ],
  controllers: [QaController]
})
export class QaModule {}
