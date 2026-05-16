import { Injectable } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IlmuchatService {

    private readonly model : ChatGoogleGenerativeAI;

    constructor(private configService : ConfigService){
        
        this.model = new ChatGoogleGenerativeAI({
            apiKey : this.configService.get('ILMU_API_KEY'),
            model : 'nemo-super',
            temperature : 0.3,
            baseUrl : 'https://api.ilmu.ai/gemini'
        })
    }

    getLlm(){
        return this.model
    }

}
