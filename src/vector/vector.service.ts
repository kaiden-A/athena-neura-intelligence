import { Injectable , OnModuleInit , OnModuleDestroy} from '@nestjs/common';
import { GoogleAiService } from 'src/google-ai/google-ai.service';
import {MongoClient} from 'mongodb'
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
@Injectable()
export class VectorService implements OnModuleInit, OnModuleDestroy {

    private client : MongoClient;
    private vectorStore :  MongoDBAtlasVectorSearch;

    constructor(private readonly googleAiService : GoogleAiService){}

    async onModuleInit() {
        this.client = new MongoClient(process.env.MONGODB_URI!);
        await this.client.connect();

        const collection = this.client.db("motionu-rag").collection("chunks");
        this.vectorStore = new MongoDBAtlasVectorSearch(
            this.googleAiService.getEmbeddingModel(),
            {
                collection : collection as any,
                indexName : "vector_index",
                textKey : "text",
                embeddingKey : "embedding",
            }
        )
    }

    async saveDocs(docs : any[]){
        return await this.vectorStore.addDocuments(docs);
    }

    async search(query : string){
        return await this.vectorStore.similaritySearch(query , 3);
    }

    async onModuleDestroy() {
        await this.client.close();
    }

}
