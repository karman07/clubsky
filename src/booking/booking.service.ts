// src/booking/booking.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    private readonly whatsappService: WhatsappService,
  ) {}

  async create(dto: CreateBookingDto & { timeSlots: number[][] }) {
    // ✅ Defensive validation inside the service (final safety net)
    if (!Array.isArray(dto.timeSlots) || dto.timeSlots.length === 0) {
      throw new BadRequestException('timeSlots is required and must be a non-empty array');
    }

    for (const slot of dto.timeSlots) {
      if (
        !Array.isArray(slot) ||
        slot.length !== 2 ||
        typeof slot[0] !== 'number' ||
        typeof slot[1] !== 'number' ||
        slot[0] >= slot[1]
      ) {
        throw new BadRequestException(
          `Invalid time slot: ${JSON.stringify(slot)}. Each slot must be [start, end] like [6,7]`,
        );
      }
    }

    // 1. Fetch all existing bookings for the same court & date
    const existing = await this.bookingModel.find({
      courtId: dto.courtId,
      date: dto.date,
    });

    // 2. Check overlap (requested slot overlaps with already booked slot)
    for (const b of existing) {
      for (const [start, end] of b.timeSlots) {
        for (const [reqStart, reqEnd] of dto.timeSlots) {
          if (!(reqEnd <= start || reqStart >= end)) {
            throw new BadRequestException(
              `Time range ${reqStart}:00 - ${reqEnd}:00 overlaps with existing booking.`,
            );
          }
        }
      }
    }

    // 3. Save booking to DB
    const booking = new this.bookingModel(dto);
    await booking.save();

    // 4. Build WhatsApp confirmation message
    const timeSlotsText = dto.timeSlots.map(([s, e]) => `${s}:00 - ${e}:00`).join(', ');
    const message =
      `✅ Booking Confirmed!\n\n` +
      `Court: ${dto.courtId}\n` +
      `Name: ${dto.name}\n` +
      `Date: ${dto.date}\n` +
      `Time Slots: ${timeSlotsText}\n` +
      `Paid: ₹${dto.paidAmount}`;

    try {
      await this.whatsappService.sendMessage(dto.phoneNumber, message);
    } catch (err) {
      // don't fail booking if WhatsApp fails, but log (or rethrow if you prefer)
      console.warn('WhatsApp send failed:', err);
    }

    return { success: true, booking };
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingModel.find().exec();
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Booking[]> {
    return this.bookingModel.find({ phoneNumber }).exec();
  }

  async findByCourtAndDate(courtId: string, date: string): Promise<Booking[]> {
    return this.bookingModel.find({ courtId, date }).exec();
  }

  async getUnavailableSlots(courtId: string, date: string): Promise<number[][]> {
    const bookings = await this.findByCourtAndDate(courtId, date);
    return bookings.flatMap((b) => b.timeSlots);
  }

  async getFullyBookedDays(courtId: string): Promise<string[]> {
    const bookings = await this.bookingModel.find({ courtId }).exec();
    const dayMap: Record<string, number> = {};

    bookings.forEach((b) => {
      if (!dayMap[b.date]) dayMap[b.date] = 0;
      dayMap[b.date] += b.timeSlots.length;
    });

    // Example rule: fully booked if >= 16 slots are taken
    return Object.keys(dayMap).filter((date) => dayMap[date] >= 16);
  }
}
