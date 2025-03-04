import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { Product } from '@prisma/client';
import { ProductDto } from './dto';

@Injectable()
export class ProductService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllProducts(): Promise<Product[]> {
    return await this.databaseService.product.findMany();
  }

  async getProductById(productId: number): Promise<Product | null> {
    const product = await this.databaseService.product.findUnique({
      where: { id: productId },
    });

    if (product && product.image) {
      return {
        ...product,
      };
    }

    return product;
  }

  async createProduct(dto: ProductDto): Promise<Product> {
    return await this.databaseService.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: Number(dto.price),
        image: dto.image ? dto.image : undefined,
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
        image: dto.image ? dto.image : undefined,
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
}
