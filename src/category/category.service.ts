import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { Category } from '@prisma/client';
import { CategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllCategorys(): Promise<Category[]> {
    return await this.databaseService.category.findMany();
  }

  async getOneCategoryById(categoryId: number): Promise<Category | null> {
    return await this.databaseService.category.findUnique({
      where: { id: categoryId },
    });
  }

  async createCategory(dto: CategoryDto): Promise<Category> {
    return await this.databaseService.category.create({
      data: {
        ...dto,
      },
    });
  }

  async updateCategory(
    categoryId: number,
    dto: CategoryDto,
  ): Promise<Category> {
    return await this.databaseService.category.update({
      where: { id: categoryId },
      data: dto,
    });
  }

  async deleteCategory(categoryId: number): Promise<Category | null> {
    return await this.databaseService.category.delete({
      where: { id: categoryId },
    });
  }
}
