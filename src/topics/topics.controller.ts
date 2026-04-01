import { Body, Controller, Post, UseGuards , Req } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { TopicsService } from './topics.service';
import { AuthGuard } from 'src/auth/auth.guard';
import type { Request } from 'express';
@Controller('topics')
export class TopicsController {


    constructor(private readonly topicService : TopicsService){}

    @UseGuards(AuthGuard)
    @Post()
    async createPost(
        @Body() data : CreateTopicDto,
        @Req() request : Request
    ){
        const user = request['user'];
        
        return this.topicService.createTopic({
            name : data.name,
            description : data.description,
            userId : user.id
        })
    }

}
