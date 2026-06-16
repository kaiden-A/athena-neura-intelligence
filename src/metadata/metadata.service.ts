import { JsonOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { GoogleAiService } from 'src/google-ai/google-ai.service';
import { IlmuchatService } from 'src/ilmuchat/ilmuchat.service';


interface MetadataOutput {
  topic: string;
  intent: string;
  keywords: string[];
  summary: string;
  difficulty: string;
  embedding_tag: string[];
}

@Injectable()
export class MetadataService {

    private metadataTemp : string;

    constructor(
        private readonly googleAi : GoogleAiService,
        private readonly ilmuAi : IlmuchatService
    ){
        const filePath = join(process.cwd(), 'src', 'prompts', 'generate-metadata.md');
        this.metadataTemp = readFileSync(filePath , 'utf-8');
    }

    async generateMetadata(topics :  string , question : string , answer : string){

        try{

            const googleLlm = this.googleAi.getLlm();
            const ilmuLlm = this.ilmuAi.getLlm();

            const prompt = PromptTemplate.fromTemplate(
                `
                {systemInstruction}

                ##INPUT DATA:
                    -Topic : {topics}
                    -Questions : {questions}
                    -Answer : {answers}

                ##FINAL RESPONSE:
                `
            )

            const parser = new JsonOutputParser<MetadataOutput>();
            const chain = prompt.pipe(googleLlm).pipe(parser);


            const result = await chain.invoke({
                systemInstruction : this.metadataTemp,
                topics : topics,
                questions : question,
                answers : answer
            })

            return result;

        }catch(error){
            console.error('Metadata Generation Error: ' +  error)
            throw new InternalServerErrorException('Failed to generate Metadata')
        }


    }

}
