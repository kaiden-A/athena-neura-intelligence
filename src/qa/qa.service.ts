import { Document } from '@langchain/core/documents';
import { Injectable } from '@nestjs/common';
import { MetadataService } from 'src/metadata/metadata.service';
import { VectorService } from 'src/vector/vector.service';
import { QaRepository } from './qa.respository';

@Injectable()
export class QaService {


    constructor(
        private readonly metadataService : MetadataService,
        private readonly vectorService : VectorService,
        private readonly qaRepository : QaRepository
    ){}

    async storedQuestionAnswer(params : {
        topicId : string,
        question : string,
        visibility : string,
        answer : string,
        createdBy : string
    }){

        const {question , answer , topicId , visibility, createdBy} = params;
        
        const metadata = await this.metadataService.generateMetadata(question , answer);

        const doc = new Document({
            pageContent : `question: ${question}\nanswer: ${answer}`,
            metadata : {
                ...metadata,
                original_question : question,
                original_answer : answer,
                created_at : new Date().toISOString()
            }
        });

        try{

            if(visibility === 'public'){
                await this.vectorService.athenaSave([doc]);
            }
            

            await this.qaRepository.create({
                topicId : topicId,
                question : question,
                answer : answer,
                visibility : visibility,
                assistant : visibility === 'public'? 'athena' : 'neura',
                createdBy : createdBy
            })

            return { 
                status : 'success',
                message : 'QA has been save to vector db'
            }

        }catch(error){
            console.error('Error saving to Vector Store: ' +  error);
            throw error;
        }
        
    }

}
