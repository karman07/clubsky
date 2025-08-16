import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Court } from '../../court/schemas/court.schema';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: Court.name, required: true })
  courtId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ type: [[Number]], required: true })
  timeSlots: number[][]; // e.g. [[10,12], [14,16]]

  @Prop({ required: true })
  date: string; // YYYY-MM-DD

  @Prop({ required: true })
  paidAmount: number;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
