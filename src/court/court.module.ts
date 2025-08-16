import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourtService } from './court.service';
import { CourtController } from './court.controller';
import { Court, CourtSchema } from './schemas/court.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Court.name, schema: CourtSchema }])],
  controllers: [CourtController],
  providers: [CourtService],
  exports: [CourtService],
})
export class CourtModule {}
