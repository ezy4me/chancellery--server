import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { OrderDto, OrderItemDto } from './dto';
import { Order } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllOrders(): Promise<Order[]> {
    return await this.databaseService.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return await this.databaseService.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                category: true,
                supplier: true,
              },
            },
          },
        },
      },
    });
  }

  async createOrder(dto: OrderDto): Promise<Order> {
    const { orderItems, payment, status, userId } = dto;

    const totalPrice = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    const createdOrder = await this.databaseService.order.create({
      data: {
        totalPrice,
        payment,
        status,
        userId,
        createdAt: new Date(),
      },
    });

    await this.databaseService.orderItems.createMany({
      data: orderItems.map((item: OrderItemDto) => ({
        orderId: createdOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    return createdOrder;
  }

  async getOrderById(orderId: number): Promise<Order | null> {
    return await this.databaseService.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });
  }

  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    return await this.databaseService.order.update({
      where: { id: Number(orderId) },
      data: { status },
    });
  }

  async deleteOrder(orderId: number): Promise<Order | null> {
    return await this.databaseService.order.delete({
      where: { id: orderId },
    });
  }
}
