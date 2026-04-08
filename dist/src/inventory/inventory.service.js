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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InventoryService = class InventoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSuppliers() {
        const suppliers = await this.prisma.supplier.findMany({
            where: { active: true },
            include: {
                stockMovements: {
                    where: {
                        type: 'STOCK_IN'
                    }
                },
                payments: true
            },
            orderBy: { name: 'asc' }
        });
        return suppliers.map((s) => {
            let totalPurchases = 0;
            let totalStockPaid = 0;
            s.stockMovements.forEach((m) => {
                const qty = Number(m.quantity) || 0;
                const cost = Number(m.unitCost) || 0;
                const paid = Number(m.paidAmount) || 0;
                totalPurchases += (qty * cost);
                totalStockPaid += paid;
            });
            const totalPayments = s.payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
            const totalPaid = totalStockPaid + totalPayments;
            const balance = totalPurchases - totalPaid;
            const { stockMovements, ...rest } = s;
            return { ...rest, totalPurchases, totalPaid, balance };
        });
    }
    async createSupplier(data) {
        return this.prisma.supplier.create({ data });
    }
    async updateSupplier(id, data) {
        const { id: _id, createdAt, updatedAt, balance, totalPurchases, totalPaid, payments, stockMovements, inventoryItems, ...cleanData } = data;
        return this.prisma.supplier.update({
            where: { id },
            data: cleanData
        });
    }
    async getItems(params) {
        return this.prisma.inventoryItem.findMany({
            where: {
                active: params.active,
                category: params.category
            },
            include: { preferredSupplier: { select: { name: true } } },
            orderBy: { name: 'asc' }
        });
    }
    async getLowStockItems() {
        const items = await this.prisma.inventoryItem.findMany({
            where: { active: true },
            include: { preferredSupplier: true },
            orderBy: { currentStock: 'asc' }
        });
        return items.filter((item) => item.currentStock <= item.minimumStock);
    }
    async getItemById(id) {
        return this.prisma.inventoryItem.findUnique({
            where: { id },
            include: {
                preferredSupplier: true,
                movements: {
                    orderBy: { createdAt: 'desc' },
                    take: 20,
                    include: { createdBy: { select: { name: true } } }
                }
            }
        });
    }
    async createItem(data) {
        return this.prisma.inventoryItem.create({ data });
    }
    async updateItem(id, data) {
        const { id: _id, createdAt, updatedAt, preferredSupplier, ...cleanData } = data;
        return this.prisma.inventoryItem.update({
            where: { id },
            data: cleanData
        });
    }
    async recordMovement(data) {
        return this.prisma.$transaction(async (tx) => {
            const item = await tx.inventoryItem.findUnique({
                where: { id: data.inventoryItemId }
            });
            if (!item)
                throw new Error('Item not found');
            let paymentStatus = data.paymentStatus || 'PAID';
            if (data.type === 'STOCK_IN' && data.unitCost) {
                const totalCost = data.quantity * data.unitCost;
                if ((data.paidAmount || 0) < totalCost) {
                    paymentStatus = 'UNPAID';
                }
                else {
                    paymentStatus = 'PAID';
                }
            }
            const movement = await tx.stockMovement.create({
                data: {
                    inventoryItemId: data.inventoryItemId,
                    type: data.type,
                    quantity: data.quantity,
                    unitCost: data.unitCost,
                    reason: data.reason,
                    referenceType: data.referenceType,
                    referenceId: data.referenceId,
                    supplierId: data.supplierId,
                    createdById: data.createdById,
                    paymentStatus,
                    paidAmount: data.paidAmount,
                    paymentMethod: data.paymentMethod || 'CASH'
                }
            });
            let newStock = item.currentStock;
            if (data.type === 'STOCK_IN' || data.type === 'ADJUSTMENT') {
                newStock += data.quantity;
            }
            else if (data.type === 'STOCK_OUT' || data.type === 'WASTAGE') {
                newStock -= data.quantity;
            }
            await tx.inventoryItem.update({
                where: { id: data.inventoryItemId },
                data: { currentStock: newStock }
            });
            return movement;
        });
    }
    async getItemMovements(id) {
        return this.prisma.stockMovement.findMany({
            where: { inventoryItemId: id },
            include: {
                createdBy: { select: { name: true } },
                supplier: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: 20
        });
    }
    async getMovements(filters = {}) {
        const page = filters.page ? +filters.page : 1;
        const limit = filters.limit ? +filters.limit : 50;
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.type && filters.type !== 'ALL')
            where.type = filters.type;
        if (filters.inventoryItemId)
            where.inventoryItemId = +filters.inventoryItemId;
        if (filters.startDate || filters.endDate) {
            where.createdAt = {};
            if (filters.startDate)
                where.createdAt.gte = new Date(filters.startDate);
            if (filters.endDate) {
                const end = new Date(filters.endDate);
                end.setHours(23, 59, 59, 999);
                where.createdAt.lte = end;
            }
        }
        if (filters.search) {
            where.OR = [
                { inventoryItem: { name: { contains: filters.search } } },
                { reason: { contains: filters.search, mode: 'insensitive' } }
            ];
        }
        const [data, total] = await Promise.all([
            this.prisma.stockMovement.findMany({
                where,
                take: limit,
                skip,
                orderBy: { createdAt: 'desc' },
                include: {
                    inventoryItem: true,
                    supplier: true,
                    createdBy: { select: { name: true } }
                }
            }),
            this.prisma.stockMovement.count({ where })
        ]);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    async getDashboardStats() {
        const [totalItems, lowStockItems, outOfStockItems, items, suppliers] = await Promise.all([
            this.prisma.inventoryItem.count({ where: { active: true } }),
            this.prisma.inventoryItem.findMany({
                where: {
                    active: true,
                    currentStock: { lte: this.prisma.inventoryItem.fields?.minimumStock || 0 }
                }
            }),
            this.prisma.inventoryItem.count({ where: { active: true, currentStock: 0 } }),
            this.prisma.inventoryItem.findMany({ where: { active: true } }),
            this.getSuppliers()
        ]);
        const totalStockValue = items.reduce((acc, item) => acc + (item.currentStock * item.costPrice), 0);
        const totalSupplierDebt = suppliers.reduce((acc, s) => acc + (s.balance || 0), 0);
        const recentMovementsResponse = await this.getMovements({ limit: 10 });
        const recentMovements = recentMovementsResponse.data;
        const categoriesMap = new Map();
        items.forEach((item) => {
            const existing = categoriesMap.get(item.category) || { count: 0, value: 0 };
            categoriesMap.set(item.category, {
                count: existing.count + 1,
                value: existing.value + (item.currentStock * item.costPrice)
            });
        });
        return {
            totalItems,
            lowStockItemsCount: lowStockItems.length,
            outOfStockItems,
            totalStockValue,
            totalSupplierDebt,
            recentMovements,
            topDebts: suppliers.filter(s => s.balance > 0).sort((a, b) => b.balance - a.balance).slice(0, 5),
            categorySummary: Array.from(categoriesMap.entries()).map(([name, stats]) => ({ name, ...stats }))
        };
    }
    async deleteMovement(id) {
        return this.prisma.$transaction(async (tx) => {
            const movement = await tx.stockMovement.findUnique({
                where: { id },
                include: { inventoryItem: true }
            });
            if (!movement)
                throw new Error('Movement not found');
            let stockDelta = 0;
            if (movement.type === 'STOCK_IN' || movement.type === 'ADJUSTMENT') {
                stockDelta = -movement.quantity;
            }
            else if (movement.type === 'STOCK_OUT' || movement.type === 'WASTAGE') {
                stockDelta = movement.quantity;
            }
            await tx.inventoryItem.update({
                where: { id: movement.inventoryItemId },
                data: { currentStock: { increment: stockDelta } }
            });
            return tx.stockMovement.delete({ where: { id } });
        });
    }
    async recordSupplierPayment(data) {
        return this.prisma.supplierPayment.create({
            data: {
                amount: data.amount,
                method: data.method || 'CASH',
                reference: data.reference,
                notes: data.notes,
                supplier: { connect: { id: data.supplierId } },
                createdBy: { connect: { id: data.createdById } }
            }
        });
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map