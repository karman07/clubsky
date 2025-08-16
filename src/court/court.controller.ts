import { Controller, Get, Post, Delete, Param, Body, UploadedFile, UseInterceptors, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CourtService } from './court.service';
import { CreateCourtDto } from './dto/create-court.dto';
import { Request } from 'express';

@Controller('courts')
export class CourtController {
  constructor(private readonly courtService: CourtService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/courts',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateCourtDto,
    @Req() req: Request
  ) {
    if (file) {
      dto.imageUrl = `${req.protocol}://${req.get('host')}/uploads/courts/${file.filename}`;
    }
    return this.courtService.create(dto);
  }

  @Get()
  findAll() {
    return this.courtService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courtService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courtService.remove(id);
  }
}
