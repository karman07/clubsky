import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { CourtModule } from '../court/court.module';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    CourtModule,
  ],
  controllers: [BookingController],
  providers: [BookingService, WhatsappService],
})
export class BookingModule {}
