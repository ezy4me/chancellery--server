import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { Supplier } from '@prisma/client';
import { SupplierDto } from './dto';
import { Public } from '@common/decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Supplier')
@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Public()
  @Get()
  async getAllSuppliers(): Promise<Supplier[]> {
    return this.supplierService.getAllSuppliers();
  }

  @Public()
  @Get(':supplierId')
  async getSupplierById(
    @Param('supplierId', ParseIntPipe) supplierId: number,
  ): Promise<Supplier | null> {
    return this.supplierService.getSupplierById(supplierId);
  }

  @Post()
  async createSupplier(@Body() supplierDto: SupplierDto): Promise<Supplier> {
    return this.supplierService.createSupplier(supplierDto);
  }

  @Put(':supplierId')
  async updateSupplier(
    @Param('supplierId', ParseIntPipe) supplierId: number,
    @Body() supplierDto: SupplierDto,
  ): Promise<Supplier> {
    return this.supplierService.updateSupplier(supplierId, supplierDto);
  }

  @Delete(':supplierId')
  async deleteSupplier(
    @Param('supplierId', ParseIntPipe) supplierId: number,
  ): Promise<Supplier | null> {
    return this.supplierService.deleteSupplier(supplierId);
  }
}
