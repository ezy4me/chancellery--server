import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { Notification } from '@prisma/client';
import { NotificationDto } from './dto';

@Injectable()
export class NotificationService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllNotifications(): Promise<Notification[]> {
    return await this.databaseService.notification.findMany();
  }

  async getNotificationById(
    notificationId: number,
  ): Promise<Notification | null> {
    return await this.databaseService.notification.findUnique({
      where: { id: notificationId },
    });
  }

  async createNotification(dto: NotificationDto): Promise<Notification> {
    return await this.databaseService.notification.create({
      data: {
        ...dto,
        createdAt: new Date(),
      },
    });
  }

  async updateNotification(
    notificationId: number,
    dto: NotificationDto,
  ): Promise<Notification> {
    return await this.databaseService.notification.update({
      where: { id: notificationId },
      data: dto,
    });
  }

  async deleteNotification(
    notificationId: number,
  ): Promise<Notification | null> {
    return await this.databaseService.notification.delete({
      where: { id: notificationId },
    });
  }
}
