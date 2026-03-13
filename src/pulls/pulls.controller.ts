import { Controller , Get } from '@nestjs/common';

@Controller('pulls')
export class PullsController {


    @Get('notion')
    async pullFromNotion(){

    }
}
