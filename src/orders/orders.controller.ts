import { Controller, Get, Post, Body, Param, Put, UseGuards, Request, Query, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles(Role.ADMIN, Role.MANAGER, Role.WAITER, Role.CASHIER)
  @Post()
  create(@Request() req: any, @Body() body: { tableNumber: string, items: { menuItemId: number, quantity: number }[] }) {
    return this.ordersService.createOrder(req.user.id, body.tableNumber, body.items);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.WAITER, Role.CASHIER)
  @Post(':id/items')
  addItems(@Param('id', ParseIntPipe) id: number, @Body() body: { items: { menuItemId: number, quantity: number }[] }) {
    return this.ordersService.addItemsToOrder(id, body.items);
  }

  @Get('queue')
  getQueue(@Request() req: any, @Query('page') page?: string, @Query('limit') limit?: string, @Query('type') type?: string) {
    return this.ordersService.getQueueItems(
      req.user.role, 
      page ? parseInt(page) : 1, 
      limit ? parseInt(limit) : 20,
      type
    );
  }

  @Get()
  findAll(@Request() req: any) {
    if (req.user.role === 'WAITER') {
      return this.ordersService.getOrdersByUser(req.user.id);
    }
    if (req.user.role === 'CASHIER') {
      return this.ordersService.getOrdersForCashier(req.user.id);
    }
    return this.ordersService.getOrders();
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.CASHIER)
  @Get('daily-summary')
  getDailySummary(@Request() req: any) {
    const cashierId = req.user.role === 'CASHIER' ? req.user.id : undefined;
    return this.ordersService.getDailySummary(cashierId);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Get('inventory-report')
  async getInventoryReport(
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.ordersService.getInventoryReport(new Date(start), new Date(end));
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.KITCHEN_STAFF, Role.BAR_STAFF)
  @Put(':id/status')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body('status') status: any) {
    return this.ordersService.updateOrderStatus(id, status);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.KITCHEN_STAFF, Role.BAR_STAFF)
  @Put('item/:itemId/status')
  updateItemStatus(@Request() req: any, @Param('itemId', ParseIntPipe) itemId: number, @Body('status') status: any) {
    return this.ordersService.updateOrderItemStatus(itemId, status, req.user.id);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.CASHIER)
  @Put(':id/payment')
  updatePayment(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number, 
    @Body() body: { paymentStatus: any, paymentMethod?: string, splitPayments?: { method: string, amount: number }[] }
  ) {
    return this.ordersService.updatePaymentStatus(id, body.paymentStatus, body.paymentMethod, body.splitPayments, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.getOrderById(id);
  }
}
