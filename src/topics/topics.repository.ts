import { Injectable } from "@nestjs/common";
import { NeonService } from "src/neon/neon.service";


@Injectable()
export class TopicsRepository{


    constructor(private readonly neonService : NeonService){}

    async create(name : string , description : string){

        const query = `
            INSERT INTO TOPICS(name , description) VALUES ($1 , $2)
        `;
        const values = [name , description];

        const res = await this.neonService.pool.query(query , values);
        return  res[0];
    }
}