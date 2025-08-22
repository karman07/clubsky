import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { BookingService } from './booking.service';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  /**
   * Robust parser for incoming timeSlots payloads.
   * Accepts:
   *  - real arrays: [[21,22]]
   *  - single slot: [9,10]
   *  - stringified arrays: '[[21,22]]'
   *  - nested wrappers: '["[[21,22]]"]' or [[ "[21,22]" ]]
   *  - string numbers: [["21","22"]]
   */
  private parseTimeSlots(timeSlots: any): number[][] {
    let parsed = timeSlots;

    if (parsed === undefined || parsed === null) {
      throw new BadRequestException('timeSlots is required');
    }

    // Try to JSON.parse repeatedly if it's a string (limit loops to avoid infinite)
    let loop = 0;
    while (typeof parsed === 'string' && loop++ < 5) {
      try {
        parsed = JSON.parse(parsed);
      } catch (err) {
        break;
      }
    }

    // If we have a direct slot [2,3] (array of two numbers or numeric-strings), wrap into [[2,3]]
    if (
      Array.isArray(parsed) &&
      parsed.length === 2 &&
      (typeof parsed[0] === 'number' || typeof parsed[0] === 'string') &&
      (typeof parsed[1] === 'number' || typeof parsed[1] === 'string')
    ) {
      parsed = [parsed];
    }

    // Unwrap single-element wrappers but STOP unwrapping if inner is a valid slot [num,num]
    // (handles e.g. [[[2,3]]] -> [[2,3]] and then stops)
    loop = 0;
    while (Array.isArray(parsed) && parsed.length === 1 && loop++ < 6) {
      const inner = parsed[0];

      // If inner is a string, try parse it (e.g. ['"[ [2,3] ]"'] cases)
      if (typeof inner === 'string') {
        try {
          const maybe = JSON.parse(inner);
          parsed = maybe;
          // continue loop to handle further nesting
          continue;
        } catch {
          // cannot parse inner string -> break out and let the validation catch it
          break;
        }
      }

      // If inner is an array of two numbers/number-strings, that means parsed === [[2,3]] -> STOP unwrapping
      if (
        Array.isArray(inner) &&
        inner.length === 2 &&
        (typeof inner[0] === 'number' || typeof inner[0] === 'string') &&
        (typeof inner[1] === 'number' || typeof inner[1] === 'string')
      ) {
        // already in the desired shape: [[start,end]]
        break;
      }

      // Otherwise unwrap one level (e.g. [[[2,3]]] -> [[2,3]])
      if (Array.isArray(inner)) {
        parsed = inner;
        continue;
      }

      // Not parseable further — break
      break;
    }

    if (!Array.isArray(parsed)) {
      throw new BadRequestException('timeSlots must be an array (e.g. [[6,7],[7,8]])');
    }

    const result: number[][] = [];

    for (const rawSlot of parsed) {
      let slot = rawSlot;

      // If slot is a string (e.g. "[21,22]"), try parse it
      if (typeof slot === 'string') {
        try {
          slot = JSON.parse(slot);
        } catch {
          throw new BadRequestException('Invalid timeSlots format. Expected array of arrays like [[6,7],[7,8]]');
        }
      }

      // If someone passed a single slot as numbers (e.g. slot === 9) — reject here
      if (!Array.isArray(slot) || slot.length !== 2) {
        throw new BadRequestException('Each time slot must be an array of 2 numbers like [6,7]');
      }

      const start = typeof slot[0] === 'string' ? parseInt(slot[0], 10) : slot[0];
      const end = typeof slot[1] === 'string' ? parseInt(slot[1], 10) : slot[1];

      if (!Number.isFinite(start) || !Number.isFinite(end) || isNaN(start) || isNaN(end)) {
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
  @UseInterceptors(AnyFilesInterceptor()) // keep if you accept multipart/form-data
  async create(@Body() body: any) {
    // Parse & normalize timeSlots robustly
    const timeSlots = this.parseTimeSlots(body.timeSlots);

    // Basic validation for other required fields (manual so we don't depend on DTO pre-validation)
    const courtId = body.courtId;
    const name = body.name;
    const phoneNumber = body.phoneNumber;
    const date = body.date;
    let paidAmount = body.paidAmount ?? body.paid; // some clients might use 'paid'

    if (!courtId || typeof courtId !== 'string') {
      throw new BadRequestException('courtId is required and must be a string');
    }
    if (!name || typeof name !== 'string') {
      throw new BadRequestException('name is required and must be a string');
    }
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      throw new BadRequestException('phoneNumber is required and must be a string');
    }
    if (!date || typeof date !== 'string') {
      throw new BadRequestException('date is required and must be a string');
    }

    if (typeof paidAmount === 'string') {
      paidAmount = paidAmount.trim() === '' ? NaN : Number(paidAmount);
    }
    if (paidAmount === undefined || paidAmount === null || isNaN(paidAmount)) {
      throw new BadRequestException('paidAmount is required and must be a number');
    }

    // Build processed DTO (timeSlots are normalized to number[][])
    const processedDto = {
      courtId,
      name,
      phoneNumber,
      date,
      paidAmount,
      email: body.email ?? '',
      paymentId: body.paymentId ?? '',
      orderId: body.orderId ?? '',
      paymentSignature: body.paymentSignature ?? '',
      paymentStatus: body.paymentStatus ?? '',
      timeSlots,
    };

    // Call service (service contains final validation)
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
  getUnavailable(@Query('courtId') courtId: string, @Query('date') date: string) {
    return this.bookingService.getUnavailableSlots(courtId, date);
  }

  @Get('fully-booked-days/:courtId')
  getFullyBookedDays(@Param('courtId') courtId: string) {
    return this.bookingService.getFullyBookedDays(courtId);
  }
}
