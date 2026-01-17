import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { PrismaService } from '../prisma.service';
import { UploadService } from '../upload/upload.service';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService, PrismaService, UploadService],
})
export class EmployeeModule {}
