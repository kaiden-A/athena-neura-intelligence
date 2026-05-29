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
            INSERT INTO TOPICS(name , description , created_by) VALUES ($1 , $2 , $3)
        `;
        const values = [name , description , createdBy];

        const res = await this.neonService.pool.query(query , values);
        return  res[0];
    }

    async getAll(){
        const query = `
        SELECT 
            id AS topicId,
            name , 
            description , 
            created_by AS createdBy    
        FROM TOPICS ORDER BY created_at DESC`;
        const res = await this.neonService.pool.query(query);
        return res.rows;
    }

    async findById(id : string){

        const query = `
            SELECT 
                name
            FROM TOPICS
            WHERE id = $1
        `

        const values = [id];
        const res = await this.neonService.pool.query(query , values);
        return res.rows[0].name;
    }
}