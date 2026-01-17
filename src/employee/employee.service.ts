import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import { PAGINATION } from '../common/constants/messages';

@Injectable()
export class EmployeeService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async getEmployees(page: number = PAGINATION.DEFAULT_PAGE, limit: number = PAGINATION.DEFAULT_LIMIT): Promise<ApiResponse> {
    const skip = (page - 1) * limit;
    const [employees, total] = await Promise.all([
      this.prisma.employee.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.employee.count(),
    ]);

    return {
      success: true,
      message: 'Xodimlar ro\'yxati',
      data: employees,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getEmployee(id: string): Promise<ApiResponse> {
    const employee = await this.prisma.employee.findUnique({ where: { id } });
    if (!employee) {
      return {
        success: false,
        message: 'Xodim topilmadi',
        data: null,
      };
    }
    return { success: true, message: 'Xodim ma\'lumoti', data: employee };
  }

  async createEmployee(createEmployeeDto: CreateEmployeeDto): Promise<ApiResponse> {
    const employee = await this.prisma.employee.create({ data: createEmployeeDto });
    return {
      success: true,
      message: 'Xodim qo\'shildi',
      data: employee,
    };
  }

  async updateEmployee(id: string, updateEmployeeDto: CreateEmployeeDto): Promise<ApiResponse> {
    const oldEmployee = await this.prisma.employee.findUnique({ where: { id } });

    if (updateEmployeeDto.image && oldEmployee?.image) {
      await this.uploadService.deleteFile(oldEmployee.image);
    }

    const employee = await this.prisma.employee.update({
      where: { id },
      data: updateEmployeeDto,
    });

    return {
      success: true,
      message: 'Xodim o\'zgartirildi',
      data: employee,
    };
  }

  async deleteEmployee(id: string): Promise<ApiResponse> {
    const employee = await this.prisma.employee.findUnique({ where: { id } });

    if (employee?.image) {
      await this.uploadService.deleteFile(employee.image);
    }

    await this.prisma.employee.delete({ where: { id } });

    return {
      success: true,
      message: 'Xodim o\'chirildi',
      data: null,
    };
  }
}
