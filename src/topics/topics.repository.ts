import { Injectable } from "@nestjs/common";
import { NeonService } from "src/neon/neon.service";


@Injectable()
export class TopicsRepository{


    constructor(private readonly neonService : NeonService){}

    async create(params : {
        name : string ; 
        description : string ; 
        createdBy : string
    }){

        const {name , description , createdBy} = params;        
        
        const query = `
            INSERT INTO TOPICS(name , description , created_by) VALUES ($1 , $2)
        `;
        const values = [name , description , createdBy];

        const res = await this.neonService.pool.query(query , values);
        return  res[0];
    }
}