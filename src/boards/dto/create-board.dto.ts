import { ApiProperty } from '@nestjs/swagger';

export class CreateBoardDto {
  @ApiProperty({
    example: 'Development Board',
    description: 'Название доски'
  })
  title: string;
}