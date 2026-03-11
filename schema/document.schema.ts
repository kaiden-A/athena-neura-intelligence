import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument } from 'mongoose';

export type DocumentDocument = Document & MongooseDocument;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({
    required: true,
    enum: ['notion', 'pdf', 'doc', 'manual'],
  })
  source: string;

  @Prop({ index: true })
  source_id?: string;

  @Prop({
    default: 'public',
    enum: ['public', 'private'],
    index: true,
  })
  visibility: 'public' | 'private';

  @Prop({ type: Object })
  metadata?: {
    course?: string;
    topic?: string;
    tags?: string[];
  };
}

export const DocumentSchema = SchemaFactory.createForClass(Document);