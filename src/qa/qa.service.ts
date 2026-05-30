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

        const metadata = await this.metadataService.generateMetadata(topicName , question , answer);

        // Build keyword-enriched content for better embedding surface
        const keywordLine = metadata?.keywords?.length
        ? `Keywords: ${metadata.keywords.join(', ')}`
        : '';

        const doc = new Document({
            pageContent: [
                `Topic: ${topicName}`,
                `Question: ${question}`,
                `Answer: ${answer}`,
                keywordLine
            ].filter(Boolean).join('\n'),

            metadata: {
                ...metadata,
                sql_id: sqlRecord.id,
                original_question: question,
                original_answer: answer,
                created_at: new Date().toISOString(),
                visibility: visibility,
            }
        });
        
        try{
            
            if (visibility === 'public') {
                await this.vectorService.athenaSave([doc], [String(sqlRecord.id)]);
            } else {
                await this.vectorService.neuraSave([doc], [String(sqlRecord.id)]);
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

    async getQuestionAnswer(topicId?: string){
        return this.qaRepository.getAll(topicId);
    }

    async updateQa(params : {
        id: string,
        topicId : string,
        question : string,
        answer : string,
        visibility : string
    }){
        const {id, question, answer, topicId, visibility} = params;

        const existing = await this.qaRepository.findById(id);
        if (!existing) {
            return { status: 'error', message: 'QA record not found' };
        }

        try {
            if (existing.visibility === 'public') {
                await this.vectorService.deleteFromAthena(String(existing.id));
            } else {
                await this.vectorService.deleteFromNeura(String(existing.id));
            }
        } catch (error) {
            console.error('Error deleting old vector: ' + error);
            throw error;
        }

        const topicName = await this.topicService.findTopicById(topicId);
        const metadata = await this.metadataService.generateMetadata(topicName, question, answer);

        const keywordLine = metadata?.keywords?.length
            ? `Keywords: ${metadata.keywords.join(', ')}`
            : '';

        const doc = new Document({
            pageContent: [
                `Topic: ${topicName}`,
                `Question: ${question}`,
                `Answer: ${answer}`,
                keywordLine
            ].filter(Boolean).join('\n'),
            metadata: {
                ...metadata,
                sql_id: existing.id,
                original_question: question,
                original_answer: answer,
                created_at: new Date().toISOString(),
                visibility: visibility,
            }
        });

        const assistant = visibility === 'public' ? 'athena' : 'neura';

        try {
            if (visibility === 'public') {
                await this.vectorService.athenaSave([doc], [String(existing.id)]);
            } else {
                await this.vectorService.neuraSave([doc], [String(existing.id)]);
            }
        } catch (error) {
            console.error('Error saving updated vector: ' + error);
            throw error;
        }

        await this.qaRepository.update(id, {
            topicId, question, answer, visibility, assistant
        });

        return {
            status: 'success',
            id: existing.id,
            message: 'QA has been updated'
        };
    }

    async deleteQa(id: string){
        const record = await this.qaRepository.findById(id);
        if (!record) {
            return { status: 'error', message: 'QA record not found' };
        }

        try {
            if (record.visibility === 'public') {
                await this.vectorService.deleteFromAthena(String(record.id));
            } else {
                await this.vectorService.deleteFromNeura(String(record.id));
            }
        } catch (error) {
            console.error('Error deleting from Vector Store: ' + error);
            throw error;
        }

        await this.qaRepository.delete(id);

        return {
            status: 'success',
            message: 'QA has been deleted from vector db'
        };
    }

}
