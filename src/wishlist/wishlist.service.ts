import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { Wishlist } from '@prisma/client';
import { WishlistDto } from './dto';

@Injectable()
export class WishlistService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getWishlistByUserId(userId: number): Promise<Wishlist[]> {
    return await this.databaseService.wishlist.findMany({
      where: { userId },
    });
  }

  async addToWishlist(dto: WishlistDto): Promise<Wishlist> {
    return await this.databaseService.wishlist.create({
      data: {
        productId: dto.productId,
        userId: dto.userId,
      },
    });
  }

  async removeFromWishlist(
    userId: number,
    productId: number,
  ): Promise<Wishlist | null> {
    return await this.databaseService.wishlist.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }
}
