import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { OrderDto, OrderItemDto } from './dto';
import { Order } from '@prisma/client';

import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  TextRun,
  BorderStyle,
} from 'docx';
import { Response } from 'express';

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
    const { orderItems, payment, status, userId, description } = dto;

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
            description,
            userId,
            createdAt: new Date(),
          },
        });

        await prisma.orderItems.createMany({
          data: orderItems.map((item: OrderItemDto) => ({
            orderId: createdOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            description: item.description,
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

  async generatePrintingContract(
    orderId: number,
    res: Response,
  ): Promise<void> {
    const order = await this.databaseService.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        orderItems: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    };

    const productsList = order.orderItems
      .map(
        (item) =>
          `${item.product.name} - ${item.quantity} шт. (${item.description})`,
      )
      .join(';\n');

    const totalAmount = order.orderItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1000,
                right: 1000,
                bottom: 1000,
                left: 1000,
              },
            },
          },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'ДОГОВОР НА ПРОИЗВОДСТВО ПОЛИГРАФИЧЕСКОЙ ПРОДУКЦИИ',
                  bold: true,
                  size: 28,
                  font: 'Times New Roman',
                }),
              ],
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),

            new Paragraph({
              text: `№ ${order.id}\t\t\t${formatDate(new Date())}`,
              alignment: AlignmentType.RIGHT,
              spacing: { after: 400 },
            }),

            new Paragraph({
              text: `ООО "СКАУТ", именуемое в дальнейшем "Исполнитель", в лице генерального директора Иванова Ивана Ивановича, действующего на основании Устава, с одной стороны, и ${order.user.email}, именуемый в дальнейшем "Заказчик", с другой стороны, заключили настоящий договор о нижеследующем:`,
              spacing: { after: 100 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: '1. Предмет договора',
                  bold: true,
                  size: 24,
                  font: 'Times New Roman',
                }),
              ],
              spacing: { after: 200 },
            }),

            new Paragraph({
              text: '1.1. Исполнитель обязуется изготовить полиграфическую продукцию в соответствии с требованиями Заказчика, а Заказчик обязуется принять и оплатить изготовленную продукцию.',
              spacing: { after: 100 },
            }),

            new Paragraph({
              text: '1.2. Перечень изготавливаемой продукции:',
              spacing: { after: 100 },
            }),

            ...productsList.split('\n').map(
              (item) =>
                new Paragraph({
                  text: item,
                  indent: { left: 500 },
                  spacing: { after: 50 },
                }),
            ),

            new Paragraph({
              text: `1.3. Общая стоимость заказа составляет ${totalAmount.toFixed(2)} рублей (НДС не облагается).`,
              spacing: { after: 400 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: '2. Сроки выполнения заказа',
                  bold: true,
                  size: 24,
                  font: 'Times New Roman',
                }),
              ],
              spacing: { after: 200 },
            }),

            new Paragraph({
              text: '2.1. Исполнитель обязуется изготовить заказ в течение 5 рабочих дней с момента подписания настоящего договора и получения 100% предоплаты.',
              spacing: { after: 100 },
            }),

            new Paragraph({
              text: '2.2. В случае задержки выполнения заказа по вине Исполнителя, Заказчик вправе требовать уплаты пени в размере 0,1% от стоимости заказа за каждый день просрочки.',
              spacing: { after: 400 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: '3. Условия оплаты',
                  bold: true,
                  size: 24,
                  font: 'Times New Roman',
                }),
              ],
              spacing: { after: 200 },
            }),

            new Paragraph({
              text: '3.1. Заказчик производит 100% предоплату заказа в течение 3 банковских дней с момента подписания договора.',
              spacing: { after: 100 },
            }),

            new Paragraph({
              text: '3.2. Оплата производится по следующим реквизитам:',
              spacing: { after: 100 },
            }),

            new Paragraph({
              text: 'ООО "СКАУТ"',
              indent: { left: 500 },
              spacing: { after: 50 },
            }),

            new Paragraph({
              text: 'ИНН 1234567890, КПП 123456789',
              indent: { left: 500 },
              spacing: { after: 50 },
            }),

            new Paragraph({
              text: 'р/с 40702810500000001234 в ПАО "Сбербанк"',
              indent: { left: 500 },
              spacing: { after: 50 },
            }),

            new Paragraph({
              text: 'к/с 30101810400000000225, БИК 044525225',
              indent: { left: 500 },
              spacing: { after: 400 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: '4. Ответственность сторон',
                  bold: true,
                  size: 24,
                  font: 'Times New Roman',
                }),
              ],
              spacing: { after: 200 },
            }),

            new Paragraph({
              text: '4.1. Исполнитель несет ответственность за соответствие изготовленной продукции требованиям, согласованным сторонами.',
              spacing: { after: 100 },
            }),

            new Paragraph({
              text: '4.2. Заказчик несет ответственность за достоверность предоставленных данных для изготовления продукции.',
              spacing: { after: 100 },
            }),

            new Paragraph({
              text: '4.3. В случае отказа Заказчика от принятия заказа после его изготовления, предоплата не возвращается.',
              spacing: { after: 400 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: '5. Прочие условия',
                  bold: true,
                  size: 24,
                  font: 'Times New Roman',
                }),
              ],
              spacing: { after: 200 },
            }),

            new Paragraph({
              text: '5.1. Все изменения и дополнения к настоящему договору действительны только в случае их оформления в письменном виде и подписания обеими сторонами.',
              spacing: { after: 100 },
            }),

            new Paragraph({
              text: '5.2. Споры и разногласия разрешаются путем переговоров, а при недостижении согласия - в судебном порядке.',
              spacing: { after: 400 },
            }),

            new Table({
              columnWidths: [50, 50],
              borders: {
                top: {
                  style: BorderStyle.NONE,
                  size: 0,
                  color: 'ffffff',
                },
                bottom: {
                  style: BorderStyle.NONE,
                  size: 0,
                  color: 'ffffff',
                },
                left: {
                  style: BorderStyle.NONE,
                  size: 0,
                  color: 'ffffff',
                },
                right: {
                  style: BorderStyle.NONE,
                  size: 0,
                  color: 'ffffff',
                },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      borders: {
                        top: {
                          style: BorderStyle.NONE,
                          size: 0,
                          color: 'ffffff',
                        },
                        bottom: {
                          style: BorderStyle.NONE,
                          size: 0,
                          color: 'ffffff',
                        },
                        left: {
                          style: BorderStyle.NONE,
                          size: 0,
                          color: 'ffffff',
                        },
                        right: {
                          style: BorderStyle.NONE,
                          size: 0,
                          color: 'ffffff',
                        },
                      },
                      children: [
                        new Paragraph({
                          text: 'Исполнитель:',
                          spacing: { after: 200 },
                        }),
                        new Paragraph({
                          text: 'ООО "СКАУТ"',
                          spacing: { after: 200 },
                        }),
                        new Paragraph({
                          text: 'Генеральный директор',
                          spacing: { after: 200 },
                        }),
                        new Paragraph({
                          text: '_________________/Иванов И.И./',
                          spacing: { after: 100 },
                        }),
                        new Paragraph({
                          text: 'М.П.',
                          spacing: { after: 100 },
                        }),
                      ],
                    }),
                    new TableCell({
                      borders: {
                        top: {
                          style: BorderStyle.NONE,
                          size: 0,
                          color: 'ffffff',
                        },
                        bottom: {
                          style: BorderStyle.NONE,
                          size: 0,
                          color: 'ffffff',
                        },
                        left: {
                          style: BorderStyle.NONE,
                          size: 0,
                          color: 'ffffff',
                        },
                        right: {
                          style: BorderStyle.NONE,
                          size: 0,
                          color: 'ffffff',
                        },
                      },
                      children: [
                        new Paragraph({
                          text: 'Заказчик:',
                          spacing: { after: 200 },
                          indent: { left: 500 },
                        }),
                        new Paragraph({
                          text: `${order.user.email}`,
                          spacing: { after: 200 },
                          indent: { left: 500 },
                        }),
                        new Paragraph({
                          text: '___________________________',
                          indent: { left: 500 },
                          spacing: { after: 200 },
                        }),
                        new Paragraph({
                          text: '___________________________',
                          indent: { left: 500 },
                          spacing: { after: 100 },
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=printing_contract_${orderId}.docx`,
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
    res.send(buffer);
  }
}
