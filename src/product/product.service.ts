import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { Product, Image } from '@prisma/client';
import { ProductDto } from './dto';
import { Express } from 'express';

@Injectable()
export class ProductService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllProducts(): Promise<Product[]> {
    return await this.databaseService.product.findMany({
      include: {
        category: true,
        supplier: true,
        image: true, // Включаем изображения
      },
    });
  }

  async getProductById(productId: number): Promise<Product | null> {
    return await this.databaseService.product.findUnique({
      where: { id: productId },
      include: { image: true }, // Включаем изображение
    });
  }

  async createProduct(dto: ProductDto): Promise<Product> {
    return await this.databaseService.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: Number(dto.price),
        imageId: dto.imageId, // Указываем imageId
        quantity: Number(dto.quantity),
        categoryId: Number(dto.categoryId),
        supplierId: Number(dto.supplierId),
      },
    });
  }

  async updateProduct(productId: number, dto: ProductDto): Promise<Product> {
    return await this.databaseService.product.update({
      where: { id: productId },
      data: {
        name: dto.name,
        description: dto.description,
        price: Number(dto.price),
        imageId: dto.imageId, // Указываем imageId
        quantity: Number(dto.quantity),
        categoryId: Number(dto.categoryId),
        supplierId: Number(dto.supplierId),
      },
    });
  }

  async deleteProduct(productId: number): Promise<Product | null> {
    return await this.databaseService.product.delete({
      where: { id: productId },
    });
  }

  // Метод для сохранения изображения
  async createImage(image: Express.Multer.File): Promise<Image> {
    return await this.databaseService.image.create({
      data: {
        name: image.originalname,
        type: image.mimetype,
        buffer: image.buffer,
      },
    });
  }
}
