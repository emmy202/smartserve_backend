import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Roles(Role.ADMIN, Role.MANAGER)
  @Get('dashboard')
  getDashboardStats(@Query('start') start: string, @Query('end') end: string) {
    if (!start || !end) return { error: 'Start and end boundaries are required' };
    return this.reportsService.getDashboardStats(start, end);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Get('kitchen-sales')
  getKitchenSales(@Query('start') start: string, @Query('end') end: string) {
    if (!start || !end) return { error: 'Start and end dates are required' };
    return this.reportsService.getKitchenSales(start, end);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Get('finance')
  getFinanceReport(@Query('start') start: string, @Query('end') end: string) {
    if (!start || !end) return { error: 'Start and end dates are required' };
    return this.reportsService.getSalesVsExpenses(start, end);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Get('ledger')
  getLedger(@Query('type') type: 'DAILY' | 'MONTHLY', @Query('start') start: string, @Query('end') end: string) {
    if (!start || !end) return { error: 'Start and end dates are required' };
    return this.reportsService.getPeriodicLedger(type || 'DAILY', start, end);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Get('profit-analysis')
  getProfitAnalysis(@Query('start') start: string, @Query('end') end: string) {
    if (!start || !end) return { error: 'Start and end boundaries are required' };
    return this.reportsService.getProfitAnalysis(start, end);
  }
}
