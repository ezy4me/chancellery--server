import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { Supplier } from '@prisma/client';
import { SupplierDto } from './dto';

@Injectable()
export class SupplierService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllSuppliers(): Promise<Supplier[]> {
    return await this.databaseService.supplier.findMany();
  }

  async getSupplierById(supplierId: number): Promise<Supplier | null> {
    return await this.databaseService.supplier.findUnique({
      where: { id: supplierId },
    });
  }

  async createSupplier(dto: SupplierDto): Promise<Supplier> {
    return await this.databaseService.supplier.create({
      data: dto,
    });
  }

  async updateSupplier(
    supplierId: number,
    dto: SupplierDto,
  ): Promise<Supplier> {
    return await this.databaseService.supplier.update({
      where: { id: supplierId },
      data: dto,
    });
  }

  async deleteSupplier(supplierId: number): Promise<Supplier | null> {
    return await this.databaseService.supplier.delete({
      where: { id: supplierId },
    });
  }
}
