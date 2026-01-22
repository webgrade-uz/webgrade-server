import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
  @ApiProperty({ example: 'Blog sarlavhasi' })
  title: string;

  @ApiProperty({ example: 'Blog mazmuni...' })
  content: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  image?: string;

  @ApiProperty({ example: 'Blog haqida qisqacha ma\'lumot', required: false })
  description?: string;

  @ApiProperty({ example: 'blog, seo, keyword1, keyword2', required: false })
  keywords?: string;

  @ApiProperty({ example: 'blog-sarlavhasi', required: false })
  slug?: string;
}
