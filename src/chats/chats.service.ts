import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class ChatsService implements OnModuleInit, OnModuleDestroy {
    private pool: Pool;

    async onModuleInit() {
        this.pool = new Pool({
            connectionString: process.env.NEON_DATABASE_URL_RAG,
            ssl: { rejectUnauthorized: false },
        });
    }

    async saveAthenaChat(userQuestion: string, aiAnswer: string, sources: any[]) {
        const query = `
            INSERT INTO athena_chat_history (user_question, ai_answer, sources)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [userQuestion, aiAnswer, JSON.stringify(sources)];
        const res = await this.pool.query(query, values);
        return res.rows[0];
    }

    async getRecentAthenaChats(limit: number = 10) {
        const query = `
            SELECT * FROM athena_chat_history
            ORDER BY created_at DESC
            LIMIT $1;
        `;
        const res = await this.pool.query(query, [limit]);
        return res.rows;
    }

    async onModuleDestroy() {
        await this.pool.end();
    }
}