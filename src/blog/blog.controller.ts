import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { CreateBlogWithFileDto } from './dto/create-blog-with-file.dto';
import { JwtAuthGuard } from '../admin/jwt-auth.guard';
import { UploadService } from '../upload/upload.service';
import { multerConfig } from '../upload/multer.config';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(
    private blogService: BlogService,
    private uploadService: UploadService,
  ) { }

  @Get()
  @ApiOperation({ summary: 'Barcha bloglar (pagination)' })
  async getBlogs(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.blogService.getBlogs(+page, +limit);
  }

  @Get('analytics/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Blog analitikasi - kunlik, haftalik, oylik, yillik' })
  async getAnalytics(@Query('period') period: string = 'daily') {
    let days = 7;
    switch (period) {
      case 'daily':
        days = 7;
        break;
      case 'weekly':
        days = 28;
        break;
      case 'monthly':
        days = 365;
        break;
      case 'yearly':
        days = 365 * 3;
        break;
    }
    return this.blogService.getAnalytics(days);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Blog ID orqali' })
  async getBlog(@Param('id') id: string, @Req() req: any) {
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      req.ip ||
      req.connection.remoteAddress ||
      'unknown';
    return this.blogService.getBlog(id, ipAddress);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Blog yaratish (rasm bilan)' })
  async createBlog(
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('description') description?: string,
    @Body('keywords') keywords?: string,
    @UploadedFile() file?: Express.Multer.File
  ) {
    const blogData: CreateBlogDto = {
      title,
      content,
      description,
      keywords,
    };
    if (file) {
      blogData.image = this.uploadService.getFileUrl(file.filename);
    }
    return this.blogService.createBlog(blogData);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Blog o\'zgartirish' })
  async updateBlog(
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('description') description?: string,
    @Body('keywords') keywords?: string,
    @UploadedFile() file?: Express.Multer.File
  ) {
    const blogData: CreateBlogDto = {
      title,
      content,
      description,
      keywords,
    };
    if (file) {
      blogData.image = this.uploadService.getFileUrl(file.filename);
    }
    return this.blogService.updateBlog(id, blogData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Blog o\'chirish' })
  async deleteBlog(@Param('id') id: string) {
    return this.blogService.deleteBlog(id);
  }
}
