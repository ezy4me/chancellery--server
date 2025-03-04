import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class WishlistDto {
  @ApiProperty()
  @IsInt()
  productId: number;

  @ApiProperty()
  @IsInt()
  userId: number;
}
