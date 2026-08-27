import { Controller, Post, UseGuards , Body , Req, Get, Query, Delete, Param, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import type { Request } from 'express';
import { qaDto } from './dto/create-qa-controller.dto';
import { updateQaDto } from './dto/update-qa-controller.dto';
import { QaService } from './qa.service';

@ApiTags('QA')
@Controller('qa')
export class QaController {

    constructor(private readonly qaService : QaService){}

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a QA record', description: 'Stores a question-answer pair in SQL and vector database' })
    @ApiBody({ type: qaDto })
    @ApiResponse({ status: 201, description: 'QA record created' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @UseGuards(AuthGuard)
    @Post()
    async storedQa(
        @Body() data : qaDto ,
        @Req() request : Request

    ){

        const user = request['user'];

        return this.qaService.storedQuestionAnswer({
            topicId : data.topicId,
            question : data.question,
            answer : data.answer,
            visibility : data.visibility,
            createdBy : user.id
        })
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'List all QAs', description: 'Returns all QA records, optionally filtered by topicId' })
    @ApiQuery({ name: 'topicId', required: false, description: 'Filter by topic ID' })
    @ApiResponse({ status: 200, description: 'List of QA records' })
    @UseGuards(AuthGuard)
    @Get()
    async getQa(
        @Query('topicId') topicId?: string
    ){
        return this.qaService.getQuestionAnswer(topicId);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get QA by ID', description: 'Returns a single QA record by its ID' })
    @ApiParam({ name: 'id', description: 'QA record ID' })
    @ApiResponse({ status: 200, description: 'QA record found' })
    @ApiResponse({ status: 404, description: 'QA record not found' })
    @UseGuards(AuthGuard)
    @Get(':id')
    async getQaById(@Param('id') id: string){
        return this.qaService.getQaById(id);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a QA record', description: 'Updates an existing QA record in SQL and re-embeds in vector database' })
    @ApiParam({ name: 'id', description: 'QA record ID' })
    @ApiBody({ type: updateQaDto })
    @ApiResponse({ status: 200, description: 'QA record updated' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'QA record not found' })
    @UseGuards(AuthGuard)
    @Put(':id')
    async updateQa(
        @Param('id') id: string,
        @Body() data : updateQaDto
    ){
        return this.qaService.updateQa({
            id,
            topicId : data.topicId,
            question : data.question,
            answer : data.answer,
            visibility : data.visibility
        })
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a QA record', description: 'Deletes a QA record from SQL and vector database' })
    @ApiParam({ name: 'id', description: 'QA record ID' })
    @ApiResponse({ status: 200, description: 'QA record deleted' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'QA record not found' })
    @UseGuards(AuthGuard)
    @Delete(':id')
    async deleteQa(
        @Param('id') id: string
    ){
        return this.qaService.deleteQa(id);
    }

}
