import { Document } from '@langchain/core/documents';
import { Injectable } from '@nestjs/common';
import { MetadataService } from 'src/metadata/metadata.service';
import { VectorService } from 'src/vector/vector.service';
import { QaRepository } from './qa.respository';
import { TopicsService } from 'src/topics/topics.service';

@Injectable()
export class QaService {


    constructor(
        private readonly metadataService : MetadataService,
        private readonly vectorService : VectorService,
        private readonly qaRepository : QaRepository,
        private readonly topicService : TopicsService
    ){}

    async storedQuestionAnswer(params : {
        topicId : string,
        question : string,
        visibility : string,
        answer : string,
        createdBy : string
    }){

        const {question , answer , topicId , visibility, createdBy} = params;


        const sqlRecord = await this.qaRepository.create({
            topicId : topicId,
            question : question,
            answer : answer,
            visibility : visibility,
            assistant : visibility === 'public'? 'athena' : 'neura',
            createdBy : createdBy
        })

        const topicName = await this.topicService.findTopicById(topicId);
        const contextPrefix = `Program/Organization: Motion-U\nTopic: ${topicName}\n`;

        const metadata = await this.metadataService.generateMetadata(topicName , question , answer);

        const doc = new Document({
            // ONLY the question goes here for embedding accuracy
            pageContent: `${contextPrefix}\nQuestion: ${question}\nAnswer: ${answer}`, 
            metadata: {
                ...metadata,
                sql_id : sqlRecord.id,
                original_question: question,
                original_answer: answer, 
                created_at: new Date().toISOString(),
                visibility: visibility,
            }
        });

        try{

            if(visibility === 'public'){
                await this.vectorService.athenaSave([doc] , [String(sqlRecord.id)]);
            }else{
                await this.vectorService.neuraSave([doc] , [String(sqlRecord.id)])
            }
        

            return { 
                status : 'success',
                id :  sqlRecord.id,
                message : 'QA has been save to vector db'
            }

        }catch(error){
            console.error('Error saving to Vector Store: ' +  error);
            throw error;
        }
        
    }

    async getQuestionAnswer(){
        return this.qaRepository.getAll();
    }

}
