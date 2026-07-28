import { ApiProperty } from '@nestjs/swagger';

export class RobloxAthenaQuestionsDto {

    @ApiProperty({ description: 'The question to ask' })
    question: string;

    @ApiProperty({ description: 'Number of relevant documents to retrieve', example: 5 })
    top_k: number;

    @ApiProperty({ description: 'Available Roblox emotes', example: ['wave', 'dance'] })
    availableEmotes: string[];
}