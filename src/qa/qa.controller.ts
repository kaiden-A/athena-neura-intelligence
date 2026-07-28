import { Controller, Post, UseGuards , Body , Req, Get, Query, Delete, Param, Put } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import type { Request } from 'express';
import { qaDto } from './dto/create-qa-controller.dto';
import { updateQaDto } from './dto/update-qa-controller.dto';
import { QaService } from './qa.service';
@Controller('qa')
export class QaController {

    constructor(private readonly qaService : QaService){}


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

    @Get()
    async getQa(
        @Query('topicId') topicId?: string
    ){
        return this.qaService.getQuestionAnswer(topicId);
    }

    @Get(':id')
    async getQaById(@Param('id') id: string){
        return this.qaService.getQaById(id);
    }

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

    @UseGuards(AuthGuard)
    @Delete(':id')
    async deleteQa(
        @Param('id') id: string
    ){
        return this.qaService.deleteQa(id);
    }

}
