import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { MESSAGES } from '../common/constants/messages';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: 200, description: MESSAGES.LOGIN_SUCCESS })
  async login(@Body() loginDto: LoginDto) {
    return this.adminService.login(loginDto.email, loginDto.password);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin logout' })
  async logout() {
    return {
      success: true,
      message: MESSAGES.LOGOUT_SUCCESS,
      data: null,
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin profili' })
  async getProfile(@Request() req) {
    return {
      success: true,
      message: 'Profil ma\'lumotlari',
      data: req.user,
    };
  }
}
