import { Body, Controller, Post } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { TopicsService } from './topics.service';

@Controller('topics')
export class TopicsController {


    constructor(private readonly topicService : TopicsService){}

    @Post()
    async createPost(
        @Body() data : CreateTopicDto
    ){
        return this.topicService.createTopic(data.name , data.description);
    }

}
