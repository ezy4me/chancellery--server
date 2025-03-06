// services/dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { DashboardDto } from './dto/dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getDashboardData(): Promise<DashboardDto> {
    const usersCount = await this.databaseService.user.count();

    const ordersCount = await this.databaseService.order.count();

    const productsCount = await this.databaseService.product.count();

    const totalRevenue = await this.databaseService.order.aggregate({
      _sum: {
        totalPrice: true,
      },
    });

    const notificationsCount = await this.databaseService.notification.count();

    const recentOrders = await this.databaseService.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
        orderItems: true,
      },
    });

    const recentProducts = await this.databaseService.product.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      usersCount,
      ordersCount,
      productsCount,
      totalRevenue: totalRevenue._sum.totalPrice?.toString() || '0',
      notificationsCount,
      recentOrders,
      recentProducts,
    };
  }
}
