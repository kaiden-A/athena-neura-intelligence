import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { AthenaQuestionsDto } from './dto/athena-questions-dto';
import { RobloxAthenaQuestionsDto } from './dto/roblox-athena-questions-dto';
import { AIGuard } from 'src/ai/ai.guard';

@ApiTags('Questions')
@Controller('questions')
export class QuestionsController {

    constructor(private readonly questionService: QuestionsService) { }

    @ApiOperation({ summary: 'Ask Athena', description: 'Ask a question to the Athena AI assistant' })
    @ApiBody({ type: AthenaQuestionsDto })
    @ApiResponse({ status: 201, description: 'AI response generated' })
    @UseGuards(AIGuard)
    @Post('athena')
    async askAthena(
        @Body() data: AthenaQuestionsDto
    ) {
        return this.questionService.askAthena({
            question : data.question,
            history : data.history,
            topK : data.top_k
        });
    }

    @ApiOperation({ summary: 'Ask Roblox Athena', description: 'Ask a question to the Roblox-specific Athena AI assistant' })
    @ApiBody({ type: RobloxAthenaQuestionsDto })
    @ApiResponse({ status: 201, description: 'AI response generated' })
    @UseGuards(AIGuard)
    @Post('roblox-athena')
    async askAthenaRoblox(@Body() data: RobloxAthenaQuestionsDto) {
        return this.questionService.askRobloxAthena(
            data.question,
            data.top_k,
            data.availableEmotes
        );
    }
}
