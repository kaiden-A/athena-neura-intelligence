import { Injectable } from '@nestjs/common';
import { TopicsRepository } from './topics.repository';

@Injectable()
export class TopicsService {

    constructor(private readonly topicRepo : TopicsRepository){}


    async createTopic(params : {
        name : string,
        description : string,
        userId : string
    }){

        const {name , description , userId} = params;

        const data = await this.topicRepo.create({
            name : name,
            description : description,
            createdBy : userId
        })

        return { 
            success : true,
            data : data
        }
    }

}
