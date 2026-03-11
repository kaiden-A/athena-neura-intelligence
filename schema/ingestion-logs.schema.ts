import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument } from 'mongoose';

export type IngestionLogDocument = IngestionLog & MongooseDocument;

@Schema({
  timestamps: {
    createdAt: 'created_at',
  },
})
export class IngestionLog {
  @Prop({
    required: true,
    enum: ['notion', 'docs'],
  })
  source: 'notion' | 'docs';

  @Prop({
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
  })
  status: 'pending' | 'success' | 'failed';

  @Prop({ default: 0 })
  pulled_items: number;

  @Prop({ default: null })
  error?: string;

  @Prop({ default: 'system' })
  triggered_by: string;
}

export const IngestionLogSchema = SchemaFactory.createForClass(IngestionLog);