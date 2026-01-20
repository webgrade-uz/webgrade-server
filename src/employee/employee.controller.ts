import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateEmployeeWithFileDto } from './dto/create-employee-with-file.dto';
import { JwtAuthGuard } from '../admin/jwt-auth.guard';
import { UploadService } from '../upload/upload.service';

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

  @Get(':id')
  @ApiOperation({ summary: 'Xodim ID orqali' })
  async getEmployee(@Param('id') id: string) {
    return this.employeeService.getEmployee(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', new UploadService().getMulterConfig()))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Xodim qo\'shish (rasm bilan)' })
  async createEmployee(@Body() createEmployeeDto: CreateEmployeeWithFileDto, @UploadedFile() file?: Express.Multer.File) {
    const employeeData: CreateEmployeeDto = {
      fullName: createEmployeeDto.fullName,
      position: createEmployeeDto.position,
      role: createEmployeeDto.role,
      about: createEmployeeDto.about,
    };
    if (file) {
      employeeData.image = this.uploadService.getFileUrl(file.filename);
    }
    return this.employeeService.createEmployee(employeeData);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', new UploadService().getMulterConfig()))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Xodim o\'zgartirish' })
  async updateEmployee(@Param('id') id: string, @Body() updateEmployeeDto: CreateEmployeeWithFileDto, @UploadedFile() file?: Express.Multer.File) {
    const employeeData: CreateEmployeeDto = {
      fullName: updateEmployeeDto.fullName,
      position: updateEmployeeDto.position,
      role: updateEmployeeDto.role,
      about: updateEmployeeDto.about,
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
