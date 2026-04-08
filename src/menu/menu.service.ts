import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async createCategory(name: string) {
    return this.prisma.menuCategory.create({ data: { name } });
  }

  async getCategories() {
    return this.prisma.menuCategory.findMany({ include: { items: true } });
  }

  async createMenuItem(data: any) {
    return this.prisma.menuItem.create({ data });
  }

  async getMenuItems() {
    return this.prisma.menuItem.findMany({ include: { category: true } });
  }

  async updateMenuItem(id: number, data: any) {
    return this.prisma.menuItem.update({ where: { id }, data });
  }

  async deleteMenuItem(id: number) {
    // 1. First delete all recipes associated with this menu item
    await (this.prisma as any).recipe.deleteMany({
      where: { menuItemId: id }
    });

    // 2. Attempt to delete the menu item
    // Note: This will still fail if there are OrderItems linked (foreign key constraint)
    try {
      return await this.prisma.menuItem.delete({ where: { id } });
    } catch (err) {
      // If it fails because of foreign key constraint, it means orders exist
      throw new Error('Cannot delete this item because it has been used in previous orders. Please deactivate it instead.');
    }
  }

  // --- Recipes ---
  async getRecipe(menuItemId: number) {
    return (this.prisma as any).recipe.findMany({
      where: { menuItemId },
      include: { inventoryItem: true }
    });
  }

  async addRecipeItem(menuItemId: number, data: { inventoryItemId: number, quantityNeeded: number }) {
    return (this.prisma as any).recipe.upsert({
      where: {
        menuItemId_inventoryItemId: {
          menuItemId,
          inventoryItemId: data.inventoryItemId
        }
      },
      update: { quantityNeeded: data.quantityNeeded },
      create: {
        menuItemId,
        inventoryItemId: data.inventoryItemId,
        quantityNeeded: data.quantityNeeded
      }
    });
  }

  async removeRecipeItem(id: number) {
    return (this.prisma as any).recipe.delete({ where: { id } });
  }
}
