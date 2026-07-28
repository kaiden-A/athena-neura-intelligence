import { ApiProperty } from '@nestjs/swagger';

export class AthenaQuestionsDto{

    @ApiProperty({ description: 'The question to ask' })
    question! : string;

    @ApiProperty({ description: 'Conversation history as JSON string' })
    history! : string;

    @ApiProperty({ description: 'Number of relevant documents to retrieve', example: 5 })
    top_k! : number;
}