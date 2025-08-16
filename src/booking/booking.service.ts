import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(@InjectModel(Booking.name) private bookingModel: Model<BookingDocument>) {}

  async create(dto: CreateBookingDto & { timeSlots: number[][] }): Promise<Booking> {
    const existing = await this.bookingModel.find({
      courtId: dto.courtId,
      date: dto.date,
    });

    // Check for overlap
    for (const b of existing) {
      for (const [start, end] of b.timeSlots) {
        for (const [reqStart, reqEnd] of dto.timeSlots) {
          if (!(reqEnd <= start || reqStart >= end)) {
            throw new BadRequestException(`Time range ${reqStart}-${reqEnd} overlaps with existing booking.`);
          }
        }
      }
    }

    const booking = new this.bookingModel(dto);
    return booking.save();
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingModel.find().populate('courtId').exec();
  }

  async findByCourtAndDate(courtId: string, date: string): Promise<Booking[]> {
    return this.bookingModel.find({ courtId, date }).exec();
  }

  async getFullyBookedDays(courtId: string): Promise<string[]> {
    const bookings = await this.bookingModel.find({ courtId }).exec();
    const dayMap: Record<string, number> = {};

    bookings.forEach(b => {
      if (!dayMap[b.date]) dayMap[b.date] = 0;
      dayMap[b.date] += b.timeSlots.length;
    });

    // Example logic: fully booked if total booked hours >= 16
    return Object.keys(dayMap).filter(date => dayMap[date] >= 16);
  }

  async getUnavailableSlots(courtId: string, date: string): Promise<number[][]> {
    const bookings = await this.findByCourtAndDate(courtId, date);
    return bookings.flatMap(b => b.timeSlots);
  }

    async findByPhoneNumber(phoneNumber: string): Promise<Booking[]> {
    return this.bookingModel.find({ phoneNumber }).populate('courtId').exec();
  }
}
