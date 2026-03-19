import { Injectable } from '@nestjs/common';
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { ConfigService } from '@nestjs/config';
@Injectable()
export class GoogleAiService {

    private readonly embeddings : GoogleGenerativeAIEmbeddings;
    private readonly model : ChatGoogleGenerativeAI;

    constructor(private configService : ConfigService){

        this.embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey : this.configService.get<string>('GOOGLE_API_KEY'),
            modelName : 'gemini-embedding-001',
            taskType : TaskType.RETRIEVAL_DOCUMENT
        })

        this.model = new ChatGoogleGenerativeAI({
            apiKey : this.configService.get<string>('GOOGLE_API_KEY'),
            model : 'gemini-2.5-flash',
            temperature : 0.3
        })
    }

    getEmbeddingModel(){
        return this.embeddings;
    }

    getLlm(){
        return this.model;
    }

}
