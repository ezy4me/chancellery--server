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
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';
import { ProductDto } from './dto';
import { Public } from '@common/decorators';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@ApiTags('product')
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

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async createProduct(
    @Body() productDto: ProductDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<Product> {
    const productData: ProductDto = {
      ...productDto,
      image: image ? image.buffer : undefined,
    };

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
      image: image ? image.buffer : undefined,
    };

    return this.productService.updateProduct(productId, productData);
  }

  @Delete(':productId')
  async deleteProduct(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<Product | null> {
    return this.productService.deleteProduct(productId);
  }
}
