import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { AthenaQuestionsDto } from './dto/athena-questions-dto';
import { AIGuard } from 'src/ai/ai.guard';
@Controller('questions')
export class QuestionsController {

    constructor(private readonly questionService : QuestionsService){}

    @UseGuards(AIGuard)
    @Post('athena')
    async askAthena(
        @Body() data : AthenaQuestionsDto
    ){
        return this.questionService.askAthena(data.question , data.top_k);
    }

}
