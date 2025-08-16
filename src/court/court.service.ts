import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Court, CourtDocument } from './schemas/court.schema';
import { CreateCourtDto } from './dto/create-court.dto';

@Injectable()
export class CourtService {
  constructor(@InjectModel(Court.name) private courtModel: Model<CourtDocument>) {}

  async create(dto: CreateCourtDto): Promise<Court> {
    const court = new this.courtModel(dto);
    return court.save();
  }

  async findAll(): Promise<Court[]> {
    return this.courtModel.find().exec();
  }

  async findOne(id: string): Promise<Court> {
    return this.courtModel.findById(id).exec();
  }

  async remove(id: string) {
    return this.courtModel.findByIdAndDelete(id).exec();
  }
}
