import { Prop , Schema , SchemaFactory } from "@nestjs/mongoose";


@Schema({
    timestamps : { 
        createdAt : 'created_at'
    },
})

export class athenaChat{

}