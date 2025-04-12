import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { Product, Image } from '@prisma/client';
import { ProductDto } from './dto';

@Injectable()
export class ProductService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllProducts(): Promise<Product[]> {
    return await this.databaseService.product.findMany({
      include: {
        category: true,
        supplier: true,
      },
    });
  }

  async getProductById(productId: number): Promise<Product | null> {
    return await this.databaseService.product.findUnique({
      where: { id: productId },
    });
  }

  async createProduct(dto: ProductDto): Promise<Product> {
    return await this.databaseService.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: Number(dto.price),
        imageId: dto.imageId,
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
        imageId: dto.imageId,
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

  async createImage(image: Express.Multer.File): Promise<Image> {
    return await this.databaseService.image.create({
      data: {
        name: image.originalname,
        type: image.mimetype,
        buffer: image.buffer,
      },
    });
  }

  async getImageByProductId(
    productId: number,
  ): Promise<{ buffer: Buffer; type: string } | null> {
    const product = await this.databaseService.product.findUnique({
      where: { id: productId },
      include: { image: true },
    });

    if (!product || !product.image) return null;

    return {
      buffer: Buffer.from(product.image.buffer),
      type: product.image.type,
    };
  }
}
