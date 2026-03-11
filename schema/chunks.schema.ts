import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document as MongooseDocument } from 'mongoose';

export type ChunkDocument = Chunk & MongooseDocument;

@Schema({
  timestamps: {
    createdAt: 'created_at',
  },
})
export class Chunk {
  @Prop({
    type: Types.ObjectId,
    ref: 'Document',
    required: true,
    index: true,
  })
  document_id: Types.ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop({
    type: [Number],
    required: true,
  })
  embedding: number[];

  @Prop({
    required: true,
    enum: ['public', 'private'],
    index: true,
  })
  visibility: 'public' | 'private';

  @Prop({ type: Object })
  metadata?: {
    page?: number;
    section?: string;
  };
}

export const ChunkSchema = SchemaFactory.createForClass(Chunk);