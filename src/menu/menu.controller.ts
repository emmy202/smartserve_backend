import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Roles(Role.ADMIN, Role.MANAGER, Role.KITCHEN_STAFF, Role.BAR_STAFF)
  @Post('category')
  createCategory(@Body('name') name: string) {
    return this.menuService.createCategory(name);
  }

  @Get('category')
  getCategories() {
    return this.menuService.getCategories();
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.KITCHEN_STAFF, Role.BAR_STAFF)
  @Post('item')
  createMenuItem(@Body() data: any) {
    return this.menuService.createMenuItem(data);
  }

  @Get('item')
  getMenuItems() {
    return this.menuService.getMenuItems();
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.KITCHEN_STAFF, Role.BAR_STAFF)
  @Put('item/:id')
  updateMenuItem(@Param('id') id: string, @Body() data: any) {
    return this.menuService.updateMenuItem(+id, data);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.KITCHEN_STAFF, Role.BAR_STAFF)
  @Delete('item/:id')
  deleteMenuItem(@Param('id') id: string) {
    return this.menuService.deleteMenuItem(+id);
  }

  // --- Recipes ---
  @Get('item/:id/recipe')
  getRecipe(@Param('id') id: string) {
    return this.menuService.getRecipe(+id);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Post('item/:id/recipe')
  addRecipeItem(@Param('id') id: string, @Body() data: any) {
    return this.menuService.addRecipeItem(+id, data);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Delete('recipe/:id')
  removeRecipeItem(@Param('id') id: string) {
    return this.menuService.removeRecipeItem(+id);
  }
}
