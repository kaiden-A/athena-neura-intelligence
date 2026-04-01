import { Body, Controller , Get, Post, UseGuards } from '@nestjs/common';
import { NotionDto } from './dto/notion-dto';
import { PullsService } from './pulls.service';
import { AIGuard } from 'src/ai/ai.guard';

@Controller('pulls')
export class PullsController {

    constructor(private readonly pullService : PullsService){}

    @UseGuards(AIGuard)
    @Post('notion')
    async pullFromNotion(
        @Body() data : NotionDto 
    ){
        return this.pullService.pullFromNotion(data.pageId , data.type);
    }
}
