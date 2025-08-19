import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { Membership, MembershipSchema } from './schemas/membership.schema';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Membership.name, schema: MembershipSchema }])],
  controllers: [MembershipController],
  providers: [MembershipService, WhatsappService],
  exports: [MembershipService],
})
export class MembershipModule {}
