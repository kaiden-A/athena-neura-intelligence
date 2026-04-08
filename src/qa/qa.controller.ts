import { Controller, Post, UseGuards , Body , Req } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import type { Request } from 'express';
import { qaDto } from './dto/create-qa-controller.dto';
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

}
