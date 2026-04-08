"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MenuService = class MenuService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCategory(name) {
        return this.prisma.menuCategory.create({ data: { name } });
    }
    async getCategories() {
        return this.prisma.menuCategory.findMany({ include: { items: true } });
    }
    async createMenuItem(data) {
        return this.prisma.menuItem.create({ data });
    }
    async getMenuItems() {
        return this.prisma.menuItem.findMany({ include: { category: true } });
    }
    async updateMenuItem(id, data) {
        return this.prisma.menuItem.update({ where: { id }, data });
    }
    async deleteMenuItem(id) {
        await this.prisma.recipe.deleteMany({
            where: { menuItemId: id }
        });
        try {
            return await this.prisma.menuItem.delete({ where: { id } });
        }
        catch (err) {
            throw new Error('Cannot delete this item because it has been used in previous orders. Please deactivate it instead.');
        }
    }
    async getRecipe(menuItemId) {
        return this.prisma.recipe.findMany({
            where: { menuItemId },
            include: { inventoryItem: true }
        });
    }
    async addRecipeItem(menuItemId, data) {
        return this.prisma.recipe.upsert({
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
    async removeRecipeItem(id) {
        return this.prisma.recipe.delete({ where: { id } });
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MenuService);
//# sourceMappingURL=menu.service.js.map