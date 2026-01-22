import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogWithFileDto {
  @ApiProperty({ example: 'Blog sarlavhasi' })
  title: string;

  @ApiProperty({ example: 'Blog mazmuni...' })
  content: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image?: any;

  @ApiProperty({ example: 'Blog haqida qisqacha ma\'lumot', required: false })
  description?: string;

  @ApiProperty({ example: 'blog, seo, keyword1, keyword2', required: false })
  keywords?: string;

  @ApiProperty({ example: 'blog-sarlavhasi', required: false })
  slug?: string;
}
