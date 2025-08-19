import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlanDocument = Plan & Document;

@Schema({ timestamps: true })
export class Plan {
  @Prop({ required: true })
  hours: number;

  @Prop({ required: true })
  price: number;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
