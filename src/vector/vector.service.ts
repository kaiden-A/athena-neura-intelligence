import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { GoogleAiService } from 'src/google-ai/google-ai.service';
import { Document } from '@langchain/core/documents';
import { Pool } from 'pg';
import { PGVectorStore } from '@langchain/community/vectorstores/pgvector';
import { NeonService } from 'src/neon/neon.service';
import { readFileSync } from 'fs';
import { join } from 'path';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';



@Injectable()
export class VectorService implements OnModuleInit{

    private athenaStore!: PGVectorStore;
    private neuraStore! : PGVectorStore;
    private queryAnalysePrompt : string;

    constructor(
        private readonly googleAiService: GoogleAiService,
        private readonly neonService : NeonService
    ) {

        const filePath = join(process.cwd() , 'src' , 'prompts' , 'analyse-query.md');
        this.queryAnalysePrompt = readFileSync(filePath , 'utf-8');
    }

    async onModuleInit() {

        const embeddings = this.googleAiService.getEmbeddingModel();

        this.athenaStore = await PGVectorStore.initialize(
            embeddings,
            {
                pool: this.neonService.pool,
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
                pool: this.neonService.pool,
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

    async athenaSave(docs: any[] , ids? : string[]) {
        return this.athenaStore.addDocuments(docs , {ids});
    }

    async deleteFromAthena(id : string){
        await this.athenaStore.delete({ids : [id]});
    }

    async neuraSave(docs: any[] , ids? : string[]) {
        return this.neuraStore.addDocuments(docs , {ids});
    }

    async athenaSearch(query: string, topK: number) {
        return this.athenaStore.similaritySearch(query, topK);
    }

    async neuraSearch(query: string, topK: number) {
        return this.neuraStore.similaritySearch(query, topK);
    }

    async hybridSearch(query : string , topK : number = 5 ){

        const analysis = await this.analyzeQuery(query);
        const k = 60;

        const vectorResults = await this.athenaStore.similaritySearch(query, topK *2);
        

        // 2. Get Keyword (BM25-like) Results via Postgres Full-Text Search
        // Note: You'll need to use your pool to query the text index directly
        const keywordString = analysis.keywords.join(' | ');
        const keywordQuery = `
                SELECT id, content, metadata 
                FROM athena_vectors
                WHERE to_tsvector('english', content) @@ plainto_tsquery('english', $1)
                OR (metadata->'keywords')::jsonb ?| $2
                LIMIT $3;
            `;

        const keywordRes = await this.neonService.pool.query(keywordQuery , [keywordString , analysis.keywords , topK * 2]);
        const keywordResults = keywordRes.rows;

        //apply the Reciprocal Rank Fusion
        const scores: Map<String , {doc: any; score : number}> = new Map();
        
        // Rank Vector Results
        vectorResults.forEach((doc, index) => {
            const id = doc.metadata.id || doc.pageContent; // Use a unique identifier
            const score = 1 / (k + (index + 1));
            scores.set(id, { doc, score });
        });

        // Rank Keyword Results and Combine
        keywordResults.forEach((row, index) => {
            const id = row.metadata.id || row.content;
            const score = 1 / (k + (index + 1));
            
            if (scores.has(id)) {
                scores.get(id)!.score += score;
            } else {
                // Convert DB row back to Document format if not in vector results
                const doc = new Document({ pageContent: row.content, metadata: row.metadata });
                scores.set(id, { doc, score });
            }
        });

        return Array.from(scores.values())
            .sort((a, b) => b.score - a.score)
            .slice(0, topK)
            .map(item => item.doc);

    }
    async analyzeQuery(query: string){

        const analysisPrompt = PromptTemplate.fromTemplate(this.queryAnalysePrompt);
        const model = this.googleAiService.getLlm();

        const chain = analysisPrompt
            .pipe(model)
            .pipe(new StringOutputParser());

        const response = await chain.invoke({ query });
        
        try {
            // 1. Strip Markdown code blocks if they exist
            // This regex removes ```json at the start and ``` at the end
            const cleanJson = response
                .replace(/```json/gi, '')
                .replace(/```/g, '')
                .trim();

            return JSON.parse(cleanJson);
        } catch (error) {
            console.error("Failed to parse AI response as JSON. Raw response:", response);
            
            // Fallback: Return a "safe" object so the app doesn't crash
            return {
                optimized_query: query,
                intent: 'general',
                keywords: [],
                is_motion_u_related: true,
                needs_clarification: false,
                clarification_message: null
            };
        }
    }



}