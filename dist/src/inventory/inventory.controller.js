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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let InventoryController = class InventoryController {
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    getDashboardStats() {
        return this.inventoryService.getDashboardStats();
    }
    getSuppliers() {
        return this.inventoryService.getSuppliers();
    }
    createSupplier(data) {
        return this.inventoryService.createSupplier(data);
    }
    updateSupplier(id, data) {
        return this.inventoryService.updateSupplier(+id, data);
    }
    recordPayment(data, req) {
        return this.inventoryService.recordSupplierPayment({
            ...data,
            createdById: req.user.id
        });
    }
    getItems(category, active) {
        return this.inventoryService.getItems({
            category,
            active: active === undefined ? undefined : active === 'true'
        });
    }
    getLowStockItems() {
        return this.inventoryService.getLowStockItems();
    }
    getItemById(id) {
        return this.inventoryService.getItemById(+id);
    }
    getItemMovements(id) {
        return this.inventoryService.getItemMovements(+id);
    }
    createItem(data) {
        return this.inventoryService.createItem(data);
    }
    updateItem(id, data) {
        return this.inventoryService.updateItem(+id, data);
    }
    recordMovement(data, req) {
        return this.inventoryService.recordMovement({
            ...data,
            createdById: req.user.id
        });
    }
    getMovements(query) {
        return this.inventoryService.getMovements(query);
    }
    deleteMovement(id) {
        return this.inventoryService.deleteMovement(+id);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('suppliers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getSuppliers", null);
__decorate([
    (0, common_1.Post)('suppliers'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER, client_1.Role.BAR_STAFF, client_1.Role.KITCHEN_STAFF),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createSupplier", null);
__decorate([
    (0, common_1.Put)('suppliers/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER, client_1.Role.BAR_STAFF, client_1.Role.KITCHEN_STAFF),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateSupplier", null);
__decorate([
    (0, common_1.Post)('suppliers/payments'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "recordPayment", null);
__decorate([
    (0, common_1.Get)('items'),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('active')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getItems", null);
__decorate([
    (0, common_1.Get)('items/low-stock'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getLowStockItems", null);
__decorate([
    (0, common_1.Get)('items/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getItemById", null);
__decorate([
    (0, common_1.Get)('items/:id/movements'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getItemMovements", null);
__decorate([
    (0, common_1.Post)('items'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createItem", null);
__decorate([
    (0, common_1.Put)('items/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Post)('movements'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "recordMovement", null);
__decorate([
    (0, common_1.Get)('movements'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getMovements", null);
__decorate([
    (0, common_1.Post)('movements/:id/undo'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "deleteMovement", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('inventory'),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map