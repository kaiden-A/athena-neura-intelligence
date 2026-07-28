import { Body, Controller, Get, Post, UseGuards , Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateTopicDto } from './dto/create-topic.dto';
import { TopicsService } from './topics.service';
import { AuthGuard } from 'src/auth/auth.guard';
import type { Request } from 'express';

@ApiTags('Topics')
@Controller('topics')
export class TopicsController {


    constructor(private readonly topicService : TopicsService){}

    @ApiOperation({ summary: 'List all topics', description: 'Returns all topics' })
    @ApiResponse({ status: 200, description: 'List of topics' })
    @Get()
    async getAllTopics(){
        return this.topicService.getAllTopics();
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a topic', description: 'Creates a new topic' })
    @ApiBody({ type: CreateTopicDto })
    @ApiResponse({ status: 201, description: 'Topic created' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
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
