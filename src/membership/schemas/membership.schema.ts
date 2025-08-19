import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MembershipDocument = Membership & Document;

@Schema({ timestamps: true })
export class Membership {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true })
  hours: number;

  @Prop({ required: true })
  price: number;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);
