import { Injectable } from '@nestjs/common';
import { MetadataService } from 'src/metadata/metadata.service';

@Injectable()
export class QaService {


    constructor(
        private readonly metadataService : MetadataService
    ){}

    async storedQuestionAnswer(){
        
    }

}
