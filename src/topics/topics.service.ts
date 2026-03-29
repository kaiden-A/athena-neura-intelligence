import { Injectable } from '@nestjs/common';
import { TopicsRepository } from './topics.repository';

@Injectable()
export class TopicsService {

    constructor(private readonly topicRepo : TopicsRepository){}


    async createTopic(name : string , description : string){
        return this.topicRepo.create(name , description);
    }

}
