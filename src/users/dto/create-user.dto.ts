import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Anvar' })
  name: string;

  @ApiProperty({ example: 'anvar@mail.com' })
  email: string;
}