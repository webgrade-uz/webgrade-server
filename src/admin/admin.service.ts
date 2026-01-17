import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import { MESSAGES, JWT_CONFIG } from '../common/constants/messages';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<ApiResponse> {
    const admin = await this.prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      return {
        success: false,
        message: MESSAGES.ADMIN_NOT_FOUND,
        data: null,
      };
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return {
        success: false,
        message: MESSAGES.INVALID_PASSWORD,
        data: null,
      };
    }

    const token = this.jwtService.sign(
      { id: admin.id, email: admin.email },
      { expiresIn: JWT_CONFIG.EXPIRATION as any },
    );

    return {
      success: true,
      message: MESSAGES.LOGIN_SUCCESS,
      data: { token, admin: { id: admin.id, email: admin.email } },
    };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return { valid: true, payload };
    } catch {
      return { valid: false, payload: null };
    }
  }
}

