import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { PrismaService } from '../prisma.service';
import { UploadService } from '../upload/upload.service';

@Module({
  controllers: [BlogController],
  providers: [BlogService, PrismaService, UploadService],
})
export class BlogModule {}
