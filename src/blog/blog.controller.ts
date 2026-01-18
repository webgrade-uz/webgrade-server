import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { CreateBlogWithFileDto } from './dto/create-blog-with-file.dto';
import { JwtAuthGuard } from '../admin/jwt-auth.guard';
import { UploadService } from '../upload/upload.service';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(
    private blogService: BlogService,
    private uploadService: UploadService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Barcha bloglar (pagination)' })
  async getBlogs(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.blogService.getBlogs(+page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Blog ID orqali' })
  async getBlog(@Param('id') id: string, @Req() req: any) {
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
    return this.blogService.getBlog(id, ipAddress);
  }

  @Get('analytics/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Blog analitikasi - kunlik, haftalik, oylik, yillik' })
  async getAnalytics(@Query('period') period: string = 'daily') {
    let days = 7;
    switch (period) {
      case 'daily':
        days = 7; // Last 7 days
        break;
      case 'weekly':
        days = 28; // Last 4 weeks
        break;
      case 'monthly':
        days = 365; // Last 12 months
        break;
      case 'yearly':
        days = 365 * 3; // Last 3 years
        break;
    }
    return this.blogService.getAnalytics(days);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', new UploadService().getMulterConfig()))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Blog yaratish (rasm bilan)' })
  async createBlog(@Body() createBlogDto: CreateBlogWithFileDto, @UploadedFile() file?: Express.Multer.File) {
    const blogData: CreateBlogDto = {
      title: createBlogDto.title,
      content: createBlogDto.content,
    };
    if (file) {
      blogData.image = `/uploads/${file.filename}`;
    }
    return this.blogService.createBlog(blogData);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', new UploadService().getMulterConfig()))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Blog o\'zgartirish' })
  async updateBlog(@Param('id') id: string, @Body() updateBlogDto: CreateBlogWithFileDto, @UploadedFile() file?: Express.Multer.File) {
    const blogData: CreateBlogDto = {
      title: updateBlogDto.title,
      content: updateBlogDto.content,
    };
    if (file) {
      blogData.image = `/uploads/${file.filename}`;
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
