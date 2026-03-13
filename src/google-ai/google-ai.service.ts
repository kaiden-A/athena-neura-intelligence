import { Injectable } from '@nestjs/common';
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
@Injectable()
export class GoogleAiService {

    private readonly embeddings : GoogleGenerativeAIEmbeddings;
    private readonly model : ChatGoogleGenerativeAI;

    constructor(){

        this.embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey : process.env.GOOGLE_API_KEY,
            modelName : 'text-embedding-004',
            taskType : TaskType.RETRIEVAL_DOCUMENT
        })

        this.model = new ChatGoogleGenerativeAI({
            apiKey : process.env.GOOGLE_API_KEY,
            model : 'gemini-1.5-flash',
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
