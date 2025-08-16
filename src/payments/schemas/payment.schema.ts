import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true })
  orderId: string;

  @Prop()
  paymentId?: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'created' })
  status: string;

  @Prop()
  receipt?: string;

  @Prop({ type: Object })
  rawResponse?: any;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
