import { Body, Controller , Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { NotionDto } from './dto/notion-dto';
import { PullsService } from './pulls.service';
import { AIGuard } from 'src/ai/ai.guard';

@ApiTags('Pulls')
@Controller('pulls')
export class PullsController {

    constructor(private readonly pullService : PullsService){}

    @ApiOperation({ summary: 'Pull from Notion', description: 'Pulls content from a Notion page and processes it' })
    @ApiBody({ type: NotionDto })
    @ApiResponse({ status: 201, description: 'Content pulled successfully' })
    @UseGuards(AIGuard)
    @Post('notion')
    async pullFromNotion(
        @Body() data : NotionDto 
    ){
        return this.pullService.pullFromNotion(data.pageId , data.type);
    }
}
