import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';
import { ProductDto } from './dto';
import { Public } from '@common/decorators';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Public()
  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  @Public()
  @Get(':productId')
  async getProductById(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<Product | null> {
    return this.productService.getProductById(productId);
  }

  @Public()
  @Get(':id/image')
  async getImageByProductId(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    const image = await this.productService.getImageByProductId(id);

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    res.set({
      'Content-Type': image.type,
      'Content-Disposition': `inline; filename="product-image-${id}"`,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'Content-Length': image.buffer.length.toString(),
    });

    res.end(image.buffer);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async createProduct(
    @Body() productDto: ProductDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<Product> {
    const productData: ProductDto = {
      ...productDto,
    };

    if (image) {
      const imageData = await this.productService.createImage(image);
      productData.imageId = imageData.id;
    }

    return this.productService.createProduct(productData);
  }

  @Put(':productId')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async updateProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() productDto: ProductDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<Product> {
    const productData: ProductDto = {
      ...productDto,
    };

    if (image) {
      const imageData = await this.productService.createImage(image);
      productData.imageId = imageData.id;
    }

    return this.productService.updateProduct(productId, productData);
  }

  @Delete(':productId')
  async deleteProduct(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<Product | null> {
    return this.productService.deleteProduct(productId);
  }
}
