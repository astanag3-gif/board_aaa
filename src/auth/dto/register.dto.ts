import { IsEmail, MinLength, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsEmail({}, {message: 'Некорректный email',  })
  @IsNotEmpty({message: 'Email не может быть пустым'})
  @IsString({message: 'Email должен быть строкой'})
  email: string;




  @ApiProperty()
  @MinLength(6,{message: 'Пароль должен быть не менее 6 символов'})
  @IsNotEmpty({message: 'Пароль не может быть пустым'})
  @IsString({message: 'Пароль должен быть строкой'})
  password: string;
}