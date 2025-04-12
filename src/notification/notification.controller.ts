import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from '@prisma/client';
import { NotificationDto } from './dto';
import { Public } from '@common/decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Public()
  @Get()
  async getAllNotifications(): Promise<Notification[]> {
    return this.notificationService.getAllNotifications();
  }

  @Public()
  @Get(':notificationId')
  async getNotificationById(
    @Param('notificationId', ParseIntPipe) notificationId: number,
  ): Promise<Notification | null> {
    return this.notificationService.getNotificationById(notificationId);
  }

  @Post()
  async createNotification(
    @Body() notificationDto: NotificationDto,
  ): Promise<Notification> {
    return this.notificationService.createNotification(notificationDto);
  }

  @Put(':notificationId')
  async updateNotification(
    @Param('notificationId', ParseIntPipe) notificationId: number,
    @Body() notificationDto: NotificationDto,
  ): Promise<Notification> {
    return this.notificationService.updateNotification(
      notificationId,
      notificationDto,
    );
  }

  @Delete(':notificationId')
  async deleteNotification(
    @Param('notificationId', ParseIntPipe) notificationId: number,
  ): Promise<Notification | null> {
    return this.notificationService.deleteNotification(notificationId);
  }
}
