import { Injectable } from '@nestjs/common';
import { VectorService } from 'src/vector/vector.service';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { NotionAPILoader } from "@langchain/community/document_loaders/web/notionapi";
import { Document } from '@langchain/core/documents';

@Injectable()
export class PullsService {

    constructor(private readonly vectorService : VectorService){}


    async pullFromNotion(pageId : string){

        const loader = new NotionAPILoader({
            clientOptions : {auth : process.env.NOTION_TOKEN},
            id : pageId
        })

        const rawDocs = await loader.load();

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 250
        });

        const chunks: Document[] = await splitter.splitDocuments(rawDocs);



        await this.vectorService.athenaSave(chunks);

        return {
            message : 'sync complete',
            chunksCreater : chunks.length
        }
    }

}
