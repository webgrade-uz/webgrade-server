import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateEmployeeWithFileDto } from './dto/create-employee-with-file.dto';
import { JwtAuthGuard } from '../admin/jwt-auth.guard';
import { UploadService } from '../upload/upload.service';
import { multerConfig } from '../upload/multer.config';

@ApiTags('Employee')
@Controller('employee')
export class EmployeeController {
  constructor(
    private employeeService: EmployeeService,
    private uploadService: UploadService,
  ) { }

  @Get()
  @ApiOperation({ summary: 'Barcha xodimlar (pagination)' })
  async getEmployees(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.employeeService.getEmployees(+page, +limit);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Xodim qo\'shish (rasm bilan)' })
  async createEmployee(
    @Body('fullName') fullName: string,
    @Body('position') position: string,
    @Body('role') role: string,
    @Body('about') about: string,
    @UploadedFile() file?: Express.Multer.File
  ) {
    const employeeData: CreateEmployeeDto = {
      fullName,
      position,
      role,
      about,
    };
    if (file) {
      employeeData.image = this.uploadService.getFileUrl(file.filename);
    }
    return this.employeeService.createEmployee(employeeData);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xodim ID orqali' })
  async getEmployee(@Param('id') id: string) {
    return this.employeeService.getEmployee(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Xodim o\'zgartirish' })
  async updateEmployee(
    @Param('id') id: string,
    @Body('fullName') fullName: string,
    @Body('position') position: string,
    @Body('role') role: string,
    @Body('about') about: string,
    @UploadedFile() file?: Express.Multer.File
  ) {
    const employeeData: CreateEmployeeDto = {
      fullName,
      position,
      role,
      about,
    };
    if (file) {
      employeeData.image = this.uploadService.getFileUrl(file.filename);
    }
    return this.employeeService.updateEmployee(id, employeeData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xodim o\'chirish' })
  async deleteEmployee(@Param('id') id: string) {
    return this.employeeService.deleteEmployee(id);
  }
}
