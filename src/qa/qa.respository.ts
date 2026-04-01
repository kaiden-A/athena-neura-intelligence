import { Injectable } from "@nestjs/common";
import { NeonService } from "src/neon/neon.service";
import { CreateQaRepo } from "./dto/create-qa-repo.dto";


@Injectable()
export class QaRepository{


    constructor(private readonly neonService : NeonService){}

    async create(data : CreateQaRepo){

        const query = `
            INSERT INTO qa (topic_id , question , answer , visibility , assistant , created_by) 
            VALUES ( $1 , $2 , $3 , $4 , $5 , $6)
        `;

        const values = [data.topicId , data.question , data.answer , data.visiblity , data.answer];
        const res = await this.neonService.pool.query(query , values);

        return res[0];
    }

}