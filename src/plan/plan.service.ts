import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Plan, PlanDocument } from './schemas/plan.schema';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlanService{
  constructor(
    @InjectModel(Plan.name) private planModel: Model<PlanDocument>,
  ) {}


  async create(dto: CreatePlanDto): Promise<Plan> {
    const created = new this.planModel(dto);
    return created.save();
  }

  async findAll(): Promise<Plan[]> {
    return this.planModel.find().exec();
  }

  async findOne(id: string): Promise<Plan> {
    const plan = await this.planModel.findById(id).exec();
    if (!plan) throw new NotFoundException('Plan not found');
    return plan;
  }

  async update(id: string, dto: UpdatePlanDto): Promise<Plan> {
    const updated = await this.planModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException('Plan not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.planModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Plan not found');
  }
}
