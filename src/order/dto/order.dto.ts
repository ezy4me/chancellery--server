import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsNumber } from 'class-validator';
import { OrderItemDto } from './order-item.dto';

export class OrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  orderItems: OrderItemDto[];

  @ApiProperty()
  @IsNumber()
  totalPrice: number;

  @ApiProperty()
  @IsString()
  payment: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsNumber()
  userId: number;
}
