import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class BookingService {
  private bookings: CreateBookingDto[] = [];

  constructor(private readonly whatsappService: WhatsappService) {}

  async create(dto: CreateBookingDto) {
    // Store booking in-memory (replace with DB in production)
    this.bookings.push(dto);

    // Format time slots
    const timeSlots = dto.timeSlots
      .map(slot => `${slot[0]}:00 - ${slot[1]}:00`)
      .join(', ');

    // Build confirmation message
    const message = `✅ Booking Confirmed!\n\nCourt: ${dto.courtId}\nName: ${dto.name}\nDate: ${dto.date}\nTime Slots: ${timeSlots}\nPaid: ₹${dto.paidAmount}`;

    // Send via WhatsApp
    await this.whatsappService.sendMessage(dto.phoneNumber, message);

    return { success: true, booking: dto };
  }

  async findAll() {
    return this.bookings;
  }

  async findByPhoneNumber(phoneNumber: string) {
    return this.bookings.filter(b => b.phoneNumber === phoneNumber);
  }

  async getUnavailableSlots(courtId: string, date: string) {
    return this.bookings
      .filter(b => b.courtId === courtId && b.date === date)
      .map(b => b.timeSlots)
      .flat();
  }

  async getFullyBookedDays(courtId: string) {
    return this.bookings
      .filter(b => b.courtId === courtId)
      .map(b => b.date);
  }
}
