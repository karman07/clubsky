import { Injectable } from '@nestjs/common';
import { InjectRazorpay } from 'nestjs-razorpay';
import Razorpay from 'razorpay';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRazorpay() private readonly razorpayClient: Razorpay,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    const options = {
      amount: dto.amount * 100, // convert to paise
      currency: 'INR',
      receipt: dto.receipt,
      payment_capture: 1,
    };

    const order = await this.razorpayClient.orders.create(options);

    // Store order in DB
    const payment = new this.paymentModel({
      orderId: order.id,
      amount: dto.amount,
      status: order.status,
      receipt: dto.receipt,
    });

    await payment.save();

    return order;
  }

  async fetchPayment(paymentId: string) {
    const paymentDetails = await this.razorpayClient.payments.fetch(paymentId);

    // Update status in DB
    await this.paymentModel.findOneAndUpdate(
      { paymentId: paymentDetails.id },
      {
        paymentId: paymentDetails.id,
        status: paymentDetails.status,
        rawResponse: paymentDetails,
      },
      { new: true, upsert: true },
    );

    return paymentDetails;
  }

  async getPaymentHistory() {
    return this.paymentModel.find().sort({ createdAt: -1 }).exec();
  }
}
