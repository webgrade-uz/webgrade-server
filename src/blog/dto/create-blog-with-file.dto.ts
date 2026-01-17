import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogWithFileDto {
  @ApiProperty({ example: 'Blog sarlavhasi' })
  title: string;

  @ApiProperty({ example: 'Blog mazmuni...' })
  content: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image?: any;
}
