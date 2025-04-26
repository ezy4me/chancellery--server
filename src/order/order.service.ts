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

    const products = await this.databaseService.product.findMany({
      where: {
        id: { in: orderItems.map((item) => item.productId) },
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of orderItems) {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new Error(`Товар с ID ${item.productId} не найден`);
      }
      if (product.quantity < item.quantity) {
        throw new Error(
          `Недостаточно товара "${product.name}" (ID: ${product.id}). Доступно: ${product.quantity}, требуется: ${item.quantity}`,
        );
      }
    }

    const totalPrice = orderItems.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0,
    );

    try {
      return await this.databaseService.$transaction(async (prisma) => {
        const createdOrder = await prisma.order.create({
          data: {
            totalPrice,
            payment,
            status,
            userId,
            createdAt: new Date(),
          },
        });

        await prisma.orderItems.createMany({
          data: orderItems.map((item: OrderItemDto) => ({
            orderId: createdOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        });

        await Promise.all(
          orderItems.map((item) =>
            prisma.product.update({
              where: { id: item.productId },
              data: {
                quantity: {
                  decrement: item.quantity,
                },
              },
            }),
          ),
        );

        return createdOrder;
      });
    } catch (error) {
      throw new Error(`Ошибка при создании заказа: ${error.message}`);
    }
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
