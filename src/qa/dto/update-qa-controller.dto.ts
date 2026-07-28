import { ApiProperty } from '@nestjs/swagger';

export class updateQaDto{

    @ApiProperty({ description: 'Topic ID the QA belongs to' })
    topicId! : string;

    @ApiProperty({ description: 'The question text' })
    question! : string;

    @ApiProperty({ description: 'The answer text' })
    answer! : string;

    @ApiProperty({ description: 'Visibility level', example: 'public' })
    visibility! : string;
}
