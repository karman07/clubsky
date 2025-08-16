import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CourtDocument = Court & Document;

@Schema({ timestamps: true })
export class Court {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  location: string;

  @Prop()
  imageUrl?: string;

  @Prop({ required: true })
  price: number; 

  @Prop({ required: true })
  activity: string;

  @Prop({ type: [String], default: [] })
  features?: string[]; // optional array of features
}

export const CourtSchema = SchemaFactory.createForClass(Court);
