import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import { MESSAGES, PAGINATION } from '../common/constants/messages';

@Injectable()
export class BlogService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async getBlogs(page: number = PAGINATION.DEFAULT_PAGE, limit: number = PAGINATION.DEFAULT_LIMIT): Promise<ApiResponse> {
    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
      this.prisma.blog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.blog.count(),
    ]);

    return {
      success: true,
      message: 'Bloglar ro\'yxati',
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getBlog(id: string, ipAddress: string): Promise<ApiResponse> {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) {
      return {
        success: false,
        message: MESSAGES.BLOG_NOT_FOUND,
        data: null,
      };
    }

    // Check if this IP already viewed this blog
    const existingView = await this.prisma.blogView.findUnique({
      where: { blogId_ipAddress: { blogId: id, ipAddress } },
    });

    if (!existingView) {
      await this.prisma.blogView.create({
        data: { blogId: id, ipAddress },
      });
      await this.prisma.blog.update({
        where: { id },
        data: { views: { increment: 1 } },
      });
    }

    const updatedBlog = await this.prisma.blog.findUnique({ where: { id } });
    return { success: true, message: 'Blog ma\'lumoti', data: updatedBlog };
  }

  async getAnalytics(days: number): Promise<ApiResponse> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const blogs = await this.prisma.blog.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: { views: 'desc' },
      select: {
        id: true,
        title: true,
        views: true,
        createdAt: true,
      },
    });

    const totalViews = blogs.reduce((sum, blog) => sum + blog.views, 0);

    return {
      success: true,
      message: `${days} kunlik blog analitikasi`,
      data: {
        period: `${days} kun`,
        totalBlogs: blogs.length,
        totalViews,
        blogs,
      },
    };
  }

  async createBlog(createBlogDto: CreateBlogDto): Promise<ApiResponse> {
    const blog = await this.prisma.blog.create({ data: createBlogDto });
    return {
      success: true,
      message: MESSAGES.BLOG_CREATED,
      data: blog,
    };
  }

  async updateBlog(id: string, updateBlogDto: CreateBlogDto): Promise<ApiResponse> {
    const oldBlog = await this.prisma.blog.findUnique({ where: { id } });

    if (updateBlogDto.image && oldBlog?.image) {
      await this.uploadService.deleteFile(oldBlog.image);
    }

    const blog = await this.prisma.blog.update({
      where: { id },
      data: updateBlogDto,
    });

    return {
      success: true,
      message: MESSAGES.BLOG_UPDATED,
      data: blog,
    };
  }

  async deleteBlog(id: string): Promise<ApiResponse> {
    const blog = await this.prisma.blog.findUnique({ where: { id } });

    if (blog?.image) {
      await this.uploadService.deleteFile(blog.image);
    }

    await this.prisma.blog.delete({ where: { id } });

    return {
      success: true,
      message: MESSAGES.BLOG_DELETED,
      data: null,
    };
  }
}
