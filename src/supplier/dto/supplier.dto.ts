import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SupplierDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  phone: string;
}
