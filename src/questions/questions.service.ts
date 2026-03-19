import { Injectable } from '@nestjs/common';
import { VectorService } from 'src/vector/vector.service';
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { GoogleAiService } from 'src/google-ai/google-ai.service';
import { ChatsService } from 'src/chats/chats.service';

@Injectable()
export class QuestionsService {


    constructor(
        private readonly vectorService : VectorService,
        private readonly googleService : GoogleAiService,
        private readonly chatService : ChatsService
    ){}


    async askAthena(question : string , topK : number){

        const releventDocs = await this.vectorService.athenaSearch(question ,topK );

        const template = `
            You are an AI assistant name ATHENA for the MOTION-U club.
            You alongside with Neura your sister you are task to help
            people nevigate around MOTION-U 
            Use the following pieces of retrieved context to answer the question. 
            If you don't know the answer, just say that you don't know. 
            Use three sentences maximum and keep the answer concise.

            Context: {context}
            Question: {question}

            Answer:
        `;

        const customPrompt = PromptTemplate.fromTemplate(template);
        const model = this.googleService.getLlm();

        const chain = RunnableSequence.from([
            {
                
                context: (input: { docs: any[]; question: string }) => 
                    input.docs.map(doc => doc.pageContent || doc.text).join("\n\n"),

                
                question: (input: { docs: any[]; question: string }) => input.question,
            },
                
            customPrompt,
            model,
            new StringOutputParser()
        ])

        const result = await chain.invoke({
            question : question,
            docs : releventDocs
        });

        await this.chatService.saveAthenaChat(question , result , releventDocs);

        return {
            answer : result,
            sources : releventDocs.map(doc => doc.metadata?.source) || 'ATHENA-GUIDE'
        }
    }

}
