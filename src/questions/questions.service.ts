import { Injectable } from '@nestjs/common';
import { VectorService } from 'src/vector/vector.service';
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { GoogleAiService } from 'src/google-ai/google-ai.service';
import { ChatsService } from 'src/chats/chats.service';
import { readFileSync } from 'fs';
import { join } from 'path';
import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { IlmuchatService } from 'src/ilmuchat/ilmuchat.service';

interface AthenaParams {
    question : string,
    history : string,
    topK : number
}

@Injectable()
export class QuestionsService {

    private athenaTemplate: string;
    private robloxAthenaTemplate: string;
    private queryOptimizerTemplate : string;

    constructor(
        private readonly vectorService: VectorService,
        private readonly googleService: GoogleAiService,
        private readonly chatService: ChatsService,
        private readonly ilmuChatService : IlmuchatService
    ) {


        const filePath = join(process.cwd(), 'src', 'prompts', 'athena-persona.md');
        this.athenaTemplate = readFileSync(filePath, 'utf-8');

        const queryOptimizerPath = join(process.cwd() , 'src' , 'prompts' , 'query-optimizer.md');
        this.queryOptimizerTemplate = readFileSync(queryOptimizerPath , 'utf-8');

        const robloxContextfilePath = join(process.cwd(), 'src', 'prompts', 'roblox-athena-persona.md');
        this.robloxAthenaTemplate = readFileSync(robloxContextfilePath, 'utf-8');
    }

    async askAthena(params : AthenaParams) {

        const {question , history , topK} = params;

        let queryOptimize = question;

        if(history.trim() !== ""){
            queryOptimize = await this.queryOptimizer(history , question);
        }
        
        const releventDocs = await this.vectorService.hybridSearch(queryOptimize, topK);

        const result = await this.finalResponse(question , releventDocs);

        const FALLBACK_MSG = "I'm sorry, I'm having trouble responding right now. Please try again in a moment.";
        if (!result.startsWith(FALLBACK_MSG)) {
            await this.chatService.saveAthenaChat(question, result, releventDocs);
        }

        return {
            answer: result,
            sources: releventDocs
        }
    }

    private async queryOptimizer(history : string , question : string){

        const llm = this.ilmuChatService.getLightLlm();

        const template = this.queryOptimizerTemplate + `
            History : {history},
            Question : {question}
        `;

        const customPrompt = PromptTemplate.fromTemplate(template);

        
        const condesedChain = RunnableSequence.from([
            customPrompt,
            llm,
            new StringOutputParser()
        ])

        const answer = await condesedChain.invoke({
            history : history,
            question : question
        })

        return answer;

    }

    private async finalResponse(question : string , releventDocs : any[]){

        try{
            const template = this.athenaTemplate + `

                Context: {{context}}
                Question: {{question}}

                Answer:
            `;

            // Explicitly switch to mustache format
            const customPrompt = new PromptTemplate({
                template: template,
                inputVariables: ["context", "question"],
                templateFormat: "mustache"
            });

            const geminiModel = this.googleService.getLlm();
            const ilmuModel = this.ilmuChatService.getLlm();

            const chain = RunnableSequence.from([
                {

                    context: (input: { docs: any[]; question: string }) =>
                        input.docs.map(doc => doc.pageContent || doc.text).join("\n\n"),


                    question: (input: { docs: any[]; question: string }) => input.question,
                },

                customPrompt,
                ilmuModel,
                new StringOutputParser()
            ])

            const result = await chain.invoke({
                question: question,
                docs: releventDocs
            });

            return result;


        }catch(err){
            console.error('LLM chain failed:', err);
            return "I'm sorry, I'm having trouble responding right now. Please try again in a moment.";
        }

    }

    async askRobloxAthena(question: string, topK: number, availableEmotes: string[]) {
        const releventDocs = await this.vectorService.hybridSearch(question, topK);

        // Ensure we have at least one fallback emote to prevent Zod crashes
        const safeEmotes = availableEmotes && availableEmotes.length > 0
            ? availableEmotes
            : ["IDLE"];

        // 1. Define the dynamic schema
        const parser = StructuredOutputParser.fromZodSchema(
            z.object({
                answer: z.string().describe("The conversational response for the Roblox chat bubble. Must be under 2 sentences and contain NO markdown."),
                // Force Zod to accept our dynamic array as an enum
                emote: z.enum(safeEmotes as [string, ...string[]])
                    .describe("The physical action Athena should perform. You MUST choose strictly from this provided list.")
            })
        );

        // 2. Inject the format instructions into the template
        const template = this.robloxAthenaTemplate + `
        You are physically standing in front of the user in a 3D world. Speak conversationally as if talking face-to-face.

        Context: {context}
        Question: {question}

        {format_instructions}
    `;

        const customPrompt = PromptTemplate.fromTemplate(template);
        const model = this.googleService.getLlm();

        // 3. Build the chain
        const chain = RunnableSequence.from([
            {
                context: (input: { docs: any[]; question: string }) =>
                    input.docs.map(doc => doc.pageContent || doc.text).join("\n\n"),
                question: (input: { docs: any[]; question: string }) => input.question,
                format_instructions: () => parser.getFormatInstructions(),
            },
            customPrompt,
            model,
            parser
        ]);

        // 4. Invoke the chain
        const result = await chain.invoke({
            question: question,
            docs: releventDocs
        });

        await this.chatService.saveAthenaChat(question, result.answer, releventDocs);

        return {
            answer: result.answer,
            emote: result.emote,
            sources: releventDocs.map(doc => doc.metadata?.source) || ['ATHENA-GUIDE']
        };
    }

}
