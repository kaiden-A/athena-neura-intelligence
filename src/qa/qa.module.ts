import { Module } from '@nestjs/common';
import { QaService } from './qa.service';
import { QaController } from './qa.controller';
import { MetadataModule } from 'src/metadata/metadata.module';

@Module({
  imports : [MetadataModule],
  providers: [QaService],
  controllers: [QaController]
})
export class QaModule {}
