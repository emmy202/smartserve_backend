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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuController = void 0;
const common_1 = require("@nestjs/common");
const menu_service_1 = require("./menu.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let MenuController = class MenuController {
    constructor(menuService) {
        this.menuService = menuService;
    }
    createCategory(name) {
        return this.menuService.createCategory(name);
    }
    getCategories() {
        return this.menuService.getCategories();
    }
    createMenuItem(data) {
        return this.menuService.createMenuItem(data);
    }
    getMenuItems() {
        return this.menuService.getMenuItems();
    }
    updateMenuItem(id, data) {
        return this.menuService.updateMenuItem(+id, data);
    }
    deleteMenuItem(id) {
        return this.menuService.deleteMenuItem(+id);
    }
    getRecipe(id) {
        return this.menuService.getRecipe(+id);
    }
    addRecipeItem(id, data) {
        return this.menuService.addRecipeItem(+id, data);
    }
    removeRecipeItem(id) {
        return this.menuService.removeRecipeItem(+id);
    }
};
exports.MenuController = MenuController;
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER, client_1.Role.KITCHEN_STAFF, client_1.Role.BAR_STAFF),
    (0, common_1.Post)('category'),
    __param(0, (0, common_1.Body)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)('category'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "getCategories", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER, client_1.Role.KITCHEN_STAFF, client_1.Role.BAR_STAFF),
    (0, common_1.Post)('item'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "createMenuItem", null);
__decorate([
    (0, common_1.Get)('item'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "getMenuItems", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER, client_1.Role.KITCHEN_STAFF, client_1.Role.BAR_STAFF),
    (0, common_1.Put)('item/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "updateMenuItem", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER, client_1.Role.KITCHEN_STAFF, client_1.Role.BAR_STAFF),
    (0, common_1.Delete)('item/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "deleteMenuItem", null);
__decorate([
    (0, common_1.Get)('item/:id/recipe'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "getRecipe", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER),
    (0, common_1.Post)('item/:id/recipe'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "addRecipeItem", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER),
    (0, common_1.Delete)('recipe/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "removeRecipeItem", null);
exports.MenuController = MenuController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('menu'),
    __metadata("design:paramtypes", [menu_service_1.MenuService])
], MenuController);
//# sourceMappingURL=menu.controller.js.map