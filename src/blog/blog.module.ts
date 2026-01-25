import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { PrismaService } from '../prisma.service';
import { UploadService } from '../upload/upload.service';
import { TelegramService } from '../common/services/telegram.service';

@Module({
  controllers: [BlogController],
  providers: [
    BlogService,
    PrismaService,
    UploadService,
    TelegramService,
    {
      provide: 'MULTER_CONFIG',
      useFactory: (uploadService: UploadService) => uploadService.getMulterConfig(),
      inject: [UploadService],
    },
  ],
})
export class BlogModule { }
