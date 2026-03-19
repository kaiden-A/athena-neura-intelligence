import { Body, Controller, Post } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { AthenaQuestionsDto } from './dto/athena-questions-dto';

@Controller('questions')
export class QuestionsController {

    constructor(private readonly questionService : QuestionsService){}


    @Post('athena')
    async askAthena(
        @Body() data : AthenaQuestionsDto
    ){
        return this.questionService.askAthena(data.question , data.top_k);
    }

}
