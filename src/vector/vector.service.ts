import { Injectable , OnModuleInit , OnModuleDestroy} from '@nestjs/common';
import { GoogleAiService } from 'src/google-ai/google-ai.service';
import {MongoClient} from 'mongodb'
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
@Injectable()
export class VectorService implements OnModuleInit, OnModuleDestroy {

    private client : MongoClient;
    private athenaStore : MongoDBAtlasVectorSearch;
    private neuraStore : MongoDBAtlasVectorSearch;

    constructor(private readonly googleAiService : GoogleAiService){}

    async onModuleInit() {
        this.client = new MongoClient(process.env.MONGODB_URI!);
        await this.client.connect();


        const athenaCollection = this.client.db('motionu-rag').collection("athenas");
        const neuraCollection = this.client.db("motionu-rag").collection("neuras");

        this.athenaStore = new MongoDBAtlasVectorSearch(
            this.googleAiService.getEmbeddingModel(),
            {
                collection : athenaCollection as any,
                indexName : "athena_index",
                textKey : "pageContent",
                embeddingKey : "embedding"
            }
        )

        this.neuraStore = new MongoDBAtlasVectorSearch(
            this.googleAiService.getEmbeddingModel(),
            {
                collection : neuraCollection as any,
                indexName : "neura_index",
                textKey : "text",
                embeddingKey : "embedding"
            }
        )
    }

    async athenaSave(docs : any[]){
        return await this.athenaStore.addDocuments(docs);
    }

    async neuraSave(docs : any[]){
        return await this.neuraStore.addDocuments(docs);
    }

    async athenaSearch(query : string , topK : number){
        return await this.athenaStore.similaritySearch(query , topK);
    }

    async neuraSearch(query : string , topK : number){
        return await this.neuraStore.similaritySearch(query , topK);
    }

    async onModuleDestroy() {
        await this.client.close();
    }

}
