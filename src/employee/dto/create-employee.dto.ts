import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @ApiProperty({ example: 'Frontend Developer' })
  position: string;

  @ApiProperty({ example: 'CEO', enum: ['CEO', 'COO', 'CTO'], required: false })
  role?: string;

  @ApiProperty({ example: 'Kompaniya haqida ma\'lumot', required: false })
  about?: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  image?: string;
}
