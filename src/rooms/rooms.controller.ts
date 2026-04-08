import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Roles(Role.ADMIN, Role.MANAGER)
  @Post()
  create(@Body() data: any) {
    return this.roomsService.create(data);
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(+id);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: any, @Req() req: any) {
    return this.roomsService.update(+id, data, req.user.id);
  }

  @Get(':id/history')
  getHistory(@Param('id') id: string) {
    return this.roomsService.getHistory(+id);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }
}
