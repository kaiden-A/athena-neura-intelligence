import { Body, Controller , Get, Post } from '@nestjs/common';
import { NotionDto } from './dto/notion-dto';
import { PullsService } from './pulls.service';

@Controller('pulls')
export class PullsController {

    constructor(private readonly pullService : PullsService){}

    @Post('notion')
    async pullFromNotion(
        @Body() data : NotionDto 
    ){
        return this.pullService.pullFromNotion(data.pageId);
    }
}
