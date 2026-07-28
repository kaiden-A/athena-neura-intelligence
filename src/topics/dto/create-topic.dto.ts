import { ApiProperty } from '@nestjs/swagger';

export class CreateTopicDto {
    
    @ApiProperty({ description: 'Topic name' })
    name! : string;

    @ApiProperty({ description: 'Topic description' })
    description! : string;
}