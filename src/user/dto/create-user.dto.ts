import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  passwordHash: string;

  @IsString()
  phone: string;

  @IsString()
  role: string;
}
