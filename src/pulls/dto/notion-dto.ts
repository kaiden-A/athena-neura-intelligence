import { ApiProperty } from '@nestjs/swagger';

export class NotionDto{

    @ApiProperty({ description: 'Notion page ID' })
    pageId : string;

    @ApiProperty({ description: 'Content type', example: 'markdown' })
    type : string;
}