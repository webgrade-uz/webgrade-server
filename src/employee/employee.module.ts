import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { PrismaService } from '../prisma.service';
import { UploadService } from '../upload/upload.service';
import { TelegramService } from '../common/services/telegram.service';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService, PrismaService, UploadService, TelegramService],
})
export class EmployeeModule { }
