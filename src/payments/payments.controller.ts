import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  UseInterceptors, 
  UploadedFiles 
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { PaymentsService } from './payments.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('order')
  @UseInterceptors(AnyFilesInterceptor()) // Parses FormData
  async createOrder(@Body() body: any) {
    // Convert form-data fields into DTO instance for validation
    const dto = plainToInstance(CreateOrderDto, {
      amount: Number(body.amount), // ensure numeric
      receipt: body.receipt
    });

    await validateOrReject(dto); // Throws if validation fails

    console.log('Validated DTO:', dto);

    return this.paymentsService.createOrder(dto);
  }

  @Get('payment/:paymentId')
  getPaymentStatus(@Param('paymentId') paymentId: string) {
    return this.paymentsService.fetchPayment(paymentId);
  }

  @Get('history')
  getPaymentHistory() {
    return this.paymentsService.getPaymentHistory();
  }
}
