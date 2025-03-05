import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@common/decorators';

@Public()
@ApiTags('wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get(':userId')
  async getWishlistByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.wishlistService.getWishlistByUserId(userId);
  }

  @Post()
  async addToWishlist(@Body() wishlistDto: WishlistDto) {
    return this.wishlistService.addToWishlist(wishlistDto);
  }

  @Delete(':userId/:productId')
  async removeFromWishlist(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.wishlistService.removeFromWishlist(userId, productId);
  }
}
