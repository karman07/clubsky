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
  // Defensive validation inside the service (final safety net)
  if (!Array.isArray(dto.timeSlots) || dto.timeSlots.length === 0) {
    throw new BadRequestException('timeSlots is required and must be a non-empty array');
  }

  // If only one slot provided → save only the start time
  let bookedSlot: number[] = [];
  if (dto.timeSlots.length === 1) {
    const slot = dto.timeSlots[0];
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
    // Save only the start time in DB as [start]
    dto.timeSlots = [[slot[0]]];
    bookedSlot = [slot[0]];
  } else {
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
    bookedSlot = dto.timeSlots.map(([start, _end]) => start);
  }

  // 1. Fetch all existing bookings for the same court & date
  const existing = await this.bookingModel.find({
    courtId: dto.courtId,
    date: dto.date,
  });

  // 2. Check overlap
  for (const b of existing) {
    for (const slot of b.timeSlots) {
      // slot could be [start, end] or [start] (for single slot)
      let start = slot[0];
      let end = slot.length === 2 ? slot[1] : slot[0] + 1;
      for (const reqSlot of dto.timeSlots) {
        let reqStart = reqSlot[0];
        let reqEnd = reqSlot.length === 2 ? reqSlot[1] : reqSlot[0] + 1;
        if (!(reqEnd <= start || reqStart >= end)) {
          throw new BadRequestException(
            `Time range ${reqStart}:00 - ${reqEnd}:00 overlaps with existing booking.`,
          );
        }
      }
    }
  }

  // 3. Save booking
  const booking = new this.bookingModel(dto);
  await booking.save();

  // 4. WhatsApp message
  let timeSlotsText = '';
  if (dto.timeSlots.length === 1 && dto.timeSlots[0].length === 1) {
    timeSlotsText = `${dto.timeSlots[0][0]}:00`;
  } else {
    timeSlotsText = dto.timeSlots.map(([s, e]) => `${s}:00 - ${e}:00`).join(', ');
  }
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
    console.warn('WhatsApp send failed:', err);
  }

  return { success: true, bookedSlot, booking };
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
