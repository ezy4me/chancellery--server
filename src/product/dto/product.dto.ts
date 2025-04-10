import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNumber, IsOptional } from 'class-validator';

export class ProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsOptional()
  imageId?: number;

  @ApiProperty()
  @IsInt()
  quantity: number;

  @ApiProperty()
  @IsInt()
  categoryId: number;

  @ApiProperty()
  @IsInt()
  supplierId: number;
}
