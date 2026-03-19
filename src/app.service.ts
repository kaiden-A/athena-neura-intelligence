import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() : any{
    return {
      message : 'RAG API SERVICE IS WORKING!',
      athena : "HII How Are You!!",
      neura : "Where Have You Been?"
    }
  }
}
