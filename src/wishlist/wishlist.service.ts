import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { Wishlist } from '@prisma/client';
import { WishlistDto } from './dto';

@Injectable()
export class WishlistService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getWishlistByUserId(userId: number): Promise<Wishlist[]> {
    return await this.databaseService.wishlist.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });
  }

  async addToWishlist(dto: WishlistDto): Promise<Wishlist> {
    try {
      return await this.databaseService.wishlist.create({
        data: {
          productId: dto.productId,
          userId: dto.userId,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'This product is already in the wishlist.',
        );
      }
      throw error;
    }
  }

  async removeFromWishlist(
    userId: number,
    productId: number,
  ): Promise<Wishlist | null> {
    try {
      return await this.databaseService.wishlist.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });
    } catch (error) {
      throw new BadRequestException('Item not found in wishlist.', error);
    }
  }
}
