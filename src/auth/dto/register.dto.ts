import { IsPasswordMatchingConstraint } from '@common/decorators';
import { IsEmail, IsString, MinLength, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  passwordHash: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  @Validate(IsPasswordMatchingConstraint)
  passwordRepeat: string;

  @ApiProperty()
  @IsString()
  role: string;
}
