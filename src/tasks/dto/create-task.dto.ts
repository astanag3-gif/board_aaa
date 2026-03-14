import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ enum: ['todo', 'in_progress', 'done'] })
  status: string;

  @ApiProperty()
  boardId: number;

  @ApiProperty()
  userId: string;
}