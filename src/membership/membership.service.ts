// src/membership/membership.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Membership, MembershipDocument } from './schemas/membership.schema';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { WhatsappService } from '../whatsapp/whatsapp.service'; // ✅ import WhatsApp service

@Injectable()
export class MembershipService {
  constructor(
    @InjectModel(Membership.name) private membershipModel: Model<MembershipDocument>,
    private readonly whatsappService: WhatsappService, // ✅ inject WhatsApp service
  ) {}

  async create(createMembershipDto: CreateMembershipDto): Promise<Membership> {
    const created = new this.membershipModel(createMembershipDto);
    const membership = await created.save();

    // ✅ Send WhatsApp message after membership creation
    const message = `🎉 Hello ${membership.name}!\n\nYour membership has been created successfully:\n📞 Phone: ${membership.phone}\n⏱ Hours: ${membership.hours}\n💰 Price: ₹${membership.price}\n\nThank you for joining us! 🙌`;

    this.whatsappService.sendMessage(membership.phone, message);

    return membership;
  }

  async findAll(): Promise<Membership[]> {
    return this.membershipModel.find().exec();
  }

  async findOne(id: string): Promise<Membership> {
    const membership = await this.membershipModel.findById(id).exec();
    if (!membership) throw new NotFoundException('Membership not found');
    return membership;
  }

  async update(id: string, updateMembershipDto: UpdateMembershipDto): Promise<Membership> {
    const updated = await this.membershipModel
      .findByIdAndUpdate(id, updateMembershipDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Membership not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const res = await this.membershipModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Membership not found');
  }
}
