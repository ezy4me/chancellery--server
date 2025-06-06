import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';
import { Order } from '@prisma/client';
import { Public } from '@common/decorators';
import { Response } from 'express';

@Controller('Orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getAllOrders(): Promise<Order[]> {
    return this.orderService.getAllOrders();
  }

  @Get('user/:userId')
  async getUserOrders(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Order[]> {
    return this.orderService.getOrdersByUser(userId);
  }

  @Post()
  async createOrder(@Body() orderDto: OrderDto): Promise<Order> {
    return this.orderService.createOrder(orderDto);
  }

  @Get(':orderId')
  async getOrderById(@Param('orderId') orderId: number): Promise<Order | null> {
    return this.orderService.getOrderById(orderId);
  }

  @Put(':orderId/status')
  async updateOrderStatus(
    @Param('orderId') orderId: number,
    @Body('status') status: string,
  ): Promise<Order> {
    return this.orderService.updateOrderStatus(orderId, status);
  }

  @Delete(':orderId')
  async deleteOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<Order | null> {
    return this.orderService.deleteOrder(orderId);
  }

  @Public()
  @Get(':orderId/document')
  async generateDocument(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Res() res: Response,
  ) {
    return this.orderService.generatePrintingContract(orderId, res);
  }
}
