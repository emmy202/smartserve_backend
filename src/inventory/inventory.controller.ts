import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('stats')
  @Roles(Role.ADMIN, Role.MANAGER)
  getDashboardStats() {
    return this.inventoryService.getDashboardStats();
  }

  // --- Suppliers ---
  @Get('suppliers')
  getSuppliers() {
    return this.inventoryService.getSuppliers();
  }

  @Post('suppliers')
  @Roles(Role.ADMIN, Role.MANAGER, Role.BAR_STAFF, Role.KITCHEN_STAFF)
  createSupplier(@Body() data: any) {
    return this.inventoryService.createSupplier(data);
  }

  @Put('suppliers/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.BAR_STAFF, Role.KITCHEN_STAFF)
  updateSupplier(@Param('id') id: string, @Body() data: any) {
    return this.inventoryService.updateSupplier(+id, data);
  }

  @Post('suppliers/payments')
  @Roles(Role.ADMIN, Role.MANAGER)
  recordPayment(@Body() data: any, @Req() req: any) {
    return this.inventoryService.recordSupplierPayment({
      ...data,
      createdById: req.user.id
    });
  }

  // --- Inventory Items ---
  @Get('items')
  getItems(@Query('categoryId') categoryId?: string, @Query('active') active?: string) {
    return this.inventoryService.getItems({
      categoryId: categoryId ? +categoryId : undefined,
      active: active === undefined ? undefined : active === 'true'
    });
  }

  @Get('items/low-stock')
  getLowStockItems() {
    return this.inventoryService.getLowStockItems();
  }

  @Get('items/:id')
  getItemById(@Param('id') id: string) {
    return this.inventoryService.getItemById(+id);
  }

  @Get('items/:id/movements')
  getItemMovements(@Param('id') id: string) {
    return this.inventoryService.getItemMovements(+id);
  }

  @Post('items')
  @Roles(Role.ADMIN, Role.MANAGER)
  createItem(@Body() data: any) {
    return this.inventoryService.createItem(data);
  }

  @Put('items/:id')
  @Roles(Role.ADMIN, Role.MANAGER)
  updateItem(@Param('id') id: string, @Body() data: any) {
    return this.inventoryService.updateItem(+id, data);
  }

  // --- Stock Movements ---
  @Post('movements')
  @Roles(Role.ADMIN, Role.MANAGER)
  recordMovement(@Body() data: any, @Req() req: any) {
    return this.inventoryService.recordMovement({
      ...data,
      createdById: req.user.id
    });
  }

  @Get('movements')
  getMovements(@Query() query: any) {
    return this.inventoryService.getMovements(query);
  }

  @Post('movements/:id/undo')
  @Roles(Role.ADMIN, Role.MANAGER)
  deleteMovement(@Param('id') id: string) {
    return this.inventoryService.deleteMovement(+id);
  }
}
