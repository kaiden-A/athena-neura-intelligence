import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { GoogleAiService } from 'src/google-ai/google-ai.service';
import { Pool } from 'pg';
import { PGVectorStore } from '@langchain/community/vectorstores/pgvector';

@Injectable()
export class VectorService implements OnModuleInit, OnModuleDestroy {

    private pool: Pool;
    private athenaStore: PGVectorStore;
    private neuraStore: PGVectorStore;

    constructor(
        private readonly googleAiService: GoogleAiService
    ) {}

    async onModuleInit() {
        this.pool = new Pool({
            connectionString: process.env.NEON_DATABASE_URL_RAG,
            ssl: { rejectUnauthorized: false }
        });

        const embeddings = this.googleAiService.getEmbeddingModel();

        this.athenaStore = await PGVectorStore.initialize(
            embeddings,
            {
                pool: this.pool,
                tableName: 'athena_vectors',
                columns: {
                idColumnName: 'id',
                vectorColumnName: 'embedding',
                contentColumnName: 'content',
                metadataColumnName: 'metadata'
                }
            }
        );

        this.neuraStore = await PGVectorStore.initialize(
            embeddings,
            {
                pool: this.pool,
                tableName: 'neura_vectors',
                columns: {
                idColumnName: 'id',
                vectorColumnName: 'embedding',
                contentColumnName: 'content',
                metadataColumnName: 'metadata'
                }
            }
        );
    }

    async athenaSave(docs: any[]) {
        return this.athenaStore.addDocuments(docs);
    }

    async neuraSave(docs: any[]) {
        return this.neuraStore.addDocuments(docs);
    }

    async athenaSearch(query: string, topK: number) {
        return this.athenaStore.similaritySearch(query, topK);
    }

    async neuraSearch(query: string, topK: number) {
        return this.neuraStore.similaritySearch(query, topK);
    }

    async onModuleDestroy() {
        await this.pool.end();
    }
}