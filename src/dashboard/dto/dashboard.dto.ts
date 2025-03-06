import { ApiProperty } from '@nestjs/swagger';

export class DashboardDto {
  @ApiProperty()
  usersCount: number;

  @ApiProperty()
  ordersCount: number;

  @ApiProperty()
  productsCount: number;

  @ApiProperty()
  totalRevenue: string;

  @ApiProperty()
  notificationsCount: number;

  @ApiProperty()
  recentOrders: any[];

  @ApiProperty()
  recentProducts: any[];
}
