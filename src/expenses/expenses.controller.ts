import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(@Request() req: any, @Body() body: { title: string, amount: number, categoryId: number, description?: string }) {
    return this.expensesService.create(req.user.id, body.title, body.amount, body.categoryId, body.description);
  }

  @Get()
  findAll(@Query('start') start?: string, @Query('end') end?: string) {
    return this.expensesService.findAll(start, end);
  }

  @Get('my')
  findByUser(@Request() req: any) {
    return this.expensesService.findByUser(req.user.id);
  }

  @Put(':id/status')
  @Roles(Role.ADMIN, Role.MANAGER)
  updateStatus(
    @Param('id') id: string, 
    @Body() body: { status: any, decisionNote?: string }
  ) {
    return this.expensesService.updateStatus(+id, body.status, body.decisionNote);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  delete(@Param('id') id: string) {
    return this.expensesService.delete(+id);
  }
}
