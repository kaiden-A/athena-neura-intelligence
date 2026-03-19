import { Injectable , OnModuleInit , OnModuleDestroy } from '@nestjs/common';
import {Pool} from 'pg';

@Injectable()
export class NeonService implements OnModuleInit , OnModuleDestroy {

    public pool : Pool;

    async onModuleInit() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL_RAG,
            ssl: { rejectUnauthorized: false },
        });

        this.pool.on('error', (err : any) => {
            console.error('Unexcpeted Neon Error ' + err); 
        });
    }

    async onModuleDestroy() {
        await this.pool.end();
        console.log('NeonService pool closed');
    }
}
