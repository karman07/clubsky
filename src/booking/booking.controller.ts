import { Controller, Get, Post, Body, Param, Query, UseInterceptors, BadRequestException } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  private parseTimeSlots(timeSlots: any): number[][] {
    let parsed = timeSlots;

    // Handle multiple levels of string nesting
    while (typeof parsed === 'string') {
      try {
        parsed = JSON.parse(parsed);
      } catch (error) {
        throw new BadRequestException('Invalid timeSlots format. Expected array of arrays like [[6,7],[7,8]]');
      }
    }

    // If it's wrapped in extra arrays, unwrap it
    while (Array.isArray(parsed) && parsed.length === 1 && Array.isArray(parsed[0])) {
      parsed = parsed[0];
    }

    // Final validation
    if (!Array.isArray(parsed)) {
      throw new BadRequestException('timeSlots must be an array');
    }

    // Convert string numbers to actual numbers and validate format
    const result: number[][] = [];
    for (const slot of parsed) {
      if (!Array.isArray(slot) || slot.length !== 2) {
        throw new BadRequestException('Each time slot must be an array of 2 numbers like [6,7]');
      }
      
      const start = typeof slot[0] === 'string' ? parseInt(slot[0], 10) : slot[0];
      const end = typeof slot[1] === 'string' ? parseInt(slot[1], 10) : slot[1];
      
      if (isNaN(start) || isNaN(end)) {
        throw new BadRequestException('Time slot values must be valid numbers');
      }
      
      if (start >= end) {
        throw new BadRequestException('Start time must be less than end time');
      }
      
      result.push([start, end]);
    }

    return result;
  }

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  create(@Body() dto: CreateBookingDto) {
    // Parse and validate timeSlots
    const parsedTimeSlots = this.parseTimeSlots(dto.timeSlots);
    
    // Update the DTO with properly parsed timeSlots
    const processedDto = {
      ...dto,
      timeSlots: parsedTimeSlots
    };

    return this.bookingService.create(processedDto);
  }

  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  
  @Get('phone/:phoneNumber')
  findByPhoneNumber(@Param('phoneNumber') phoneNumber: string) {
    return this.bookingService.findByPhoneNumber(phoneNumber);
  }

  @Get('unavailable')
  getUnavailable(
    @Query('courtId') courtId: string,
    @Query('date') date: string
  ) {
    return this.bookingService.getUnavailableSlots(courtId, date);
  }

  @Get('fully-booked-days/:courtId')
  getFullyBookedDays(@Param('courtId') courtId: string) {
    return this.bookingService.getFullyBookedDays(courtId);
  }
}