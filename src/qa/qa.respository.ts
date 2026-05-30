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
            RETURNING *
        `;

        const values = [data.topicId , data.question , data.answer , data.visibility , data.assistant , data.createdBy];
        const res = await this.neonService.pool.query(query , values);

        return res.rows[0];
    }

    async findById(id: string){
        const query = `SELECT * FROM qa WHERE id = $1`;
        const res = await this.neonService.pool.query(query, [id]);
        return res.rows[0] || null;
    }

    async delete(id: string){
        const query = `DELETE FROM qa WHERE id = $1 RETURNING *`;
        const res = await this.neonService.pool.query(query, [id]);
        return res.rows[0] || null;
    }

    async getAll(topicId?: string){

        let query = `SELECT * FROM qa`;
        const values: string[] = [];

        if (topicId) {
            query += ` WHERE topic_id = $1`;
            values.push(topicId);
        }

        const res = await this.neonService.pool.query(query, values);
        return res.rows;

    }

}