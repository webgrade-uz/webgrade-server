import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
  @ApiProperty({ example: 'Blog sarlavhasi' })
  title: string;

  @ApiProperty({ example: 'Blog mazmuni...' })
  content: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  image?: string;
}
