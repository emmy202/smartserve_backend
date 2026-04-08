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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrdersService = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrder(userId, tableNumber, items) {
        let totalAmount = 0;
        for (const item of items) {
            if (!item.menuItemId)
                continue;
            const menuItem = await this.prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
            if (!menuItem)
                continue;
            if (!menuItem.available) {
                throw new Error(`Item ${menuItem.name} is currently out of stock/unavailable.`);
            }
            if (menuItem.trackStock && menuItem.stockQuantity < item.quantity) {
                throw new Error(`Only ${menuItem.stockQuantity} units of ${menuItem.name} remaining in stock.`);
            }
            totalAmount += menuItem.price * item.quantity;
        }
        const order = await this.prisma.order.create({
            data: {
                userId,
                tableNumber,
                totalAmount,
                items: {
                    create: items.map(i => ({
                        menuItemId: i.menuItemId,
                        quantity: i.quantity
                    }))
                }
            },
            include: { items: { include: { menuItem: true } } }
        });
        for (const item of items) {
            const recipes = await this.prisma.recipe.findMany({
                where: { menuItemId: item.menuItemId }
            });
            if (recipes.length > 0) {
                for (const recipe of recipes) {
                    const qtyToDeduct = recipe.quantityNeeded * item.quantity;
                    await this.prisma.inventoryItem.update({
                        where: { id: recipe.inventoryItemId },
                        data: { currentStock: { decrement: qtyToDeduct } }
                    });
                    await this.prisma.stockMovement.create({
                        data: {
                            inventoryItemId: recipe.inventoryItemId,
                            type: 'STOCK_OUT',
                            quantity: qtyToDeduct,
                            reason: `Sale: Order #${order.id}`,
                            createdById: userId,
                            referenceType: 'ORDER',
                            referenceId: order.id.toString()
                        }
                    });
                }
            }
            else {
                const menuItem = await this.prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
                if (menuItem && menuItem.trackStock) {
                    const newQty = Math.max(0, menuItem.stockQuantity - item.quantity);
                    await this.prisma.menuItem.update({
                        where: { id: menuItem.id },
                        data: {
                            stockQuantity: newQty,
                            available: newQty > 0
                        }
                    });
                }
            }
        }
        return order;
    }
    async addItemsToOrder(orderId, items) {
        let additionalAmount = 0;
        for (const item of items) {
            const menuItem = await this.prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
            if (!menuItem)
                continue;
            if (!menuItem.available) {
                throw new Error(`Item ${menuItem.name} is currently out of stock.`);
            }
            if (menuItem.trackStock && menuItem.stockQuantity < item.quantity) {
                throw new Error(`Insufficient stock for ${menuItem.name}.`);
            }
            additionalAmount += menuItem.price * item.quantity;
        }
        const updatedOrder = await this.prisma.order.update({
            where: { id: orderId },
            data: {
                totalAmount: { increment: additionalAmount },
                items: {
                    create: items.map(i => ({
                        menuItemId: i.menuItemId,
                        quantity: i.quantity
                    }))
                }
            },
            include: { items: { include: { menuItem: true } } }
        });
        for (const item of items) {
            const recipes = await this.prisma.recipe.findMany({
                where: { menuItemId: item.menuItemId }
            });
            if (recipes.length > 0) {
                for (const recipe of recipes) {
                    const qtyToDeduct = recipe.quantityNeeded * item.quantity;
                    await this.prisma.inventoryItem.update({
                        where: { id: recipe.inventoryItemId },
                        data: { currentStock: { decrement: qtyToDeduct } }
                    });
                    await this.prisma.stockMovement.create({
                        data: {
                            inventoryItemId: recipe.inventoryItemId,
                            type: 'STOCK_OUT',
                            quantity: qtyToDeduct,
                            reason: `Sale Correction: Add to Order #${updatedOrder.id}`,
                            createdById: updatedOrder.userId,
                            referenceType: 'ORDER',
                            referenceId: updatedOrder.id.toString()
                        }
                    });
                }
            }
            else {
                if (!item.menuItemId)
                    continue;
                const menuItem = await this.prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
                if (menuItem && menuItem.trackStock) {
                    const newQty = Math.max(0, menuItem.stockQuantity - item.quantity);
                    await this.prisma.menuItem.update({
                        where: { id: menuItem.id },
                        data: {
                            stockQuantity: newQty,
                            available: newQty > 0
                        }
                    });
                }
            }
        }
        return updatedOrder;
    }
    async getQueueItems(role, page = 1, limit = 10, type) {
        const skip = (page - 1) * limit;
        let typeFilter = type;
        if (!typeFilter) {
            if (role === 'KITCHEN_STAFF')
                typeFilter = 'FOOD';
            if (role === 'BAR_STAFF')
                typeFilter = 'DRINK';
        }
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
        const where = {
            order: {
                status: { not: 'CANCELLED' }
            }
        };
        if (typeFilter) {
            where.menuItem = { type: typeFilter };
        }
        where.NOT = {
            status: 'DELIVERED',
            OR: [
                { deliveredAt: { lt: twoHoursAgo } },
                { updatedAt: { lt: twoHoursAgo }, deliveredAt: null }
            ]
        };
        const [total, pendingTotal, items] = await Promise.all([
            this.prisma.orderItem.count({ where }),
            this.prisma.orderItem.count({ where: { ...where, status: 'PENDING' } }),
            this.prisma.orderItem.findMany({
                where,
                include: {
                    menuItem: true,
                    order: { include: { user: { select: { name: true } } } },
                    preparedBy: { select: { name: true } }
                },
                orderBy: { createdAt: 'asc' },
                skip,
                take: limit,
            })
        ]);
        return {
            data: items,
            meta: {
                total,
                pendingTotal,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    async getOrders() {
        return this.prisma.order.findMany({
            include: {
                items: { include: { menuItem: true, preparedBy: { select: { name: true } } } },
                user: { select: { name: true } },
                cashier: { select: { name: true } },
                payments: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getOrdersForCashier(cashierId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return this.prisma.order.findMany({
            where: {
                OR: [
                    { paymentStatus: 'UNPAID' },
                    {
                        AND: [
                            { paymentStatus: 'PAID' },
                            { cashierId: cashierId },
                            { updatedAt: { gte: today } }
                        ]
                    }
                ]
            },
            include: {
                items: { include: { menuItem: true, preparedBy: { select: { name: true } } } },
                user: { select: { name: true } },
                cashier: { select: { name: true } },
                payments: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getOrdersByUser(userId) {
        return this.prisma.order.findMany({
            where: { userId },
            include: {
                items: { include: { menuItem: true, preparedBy: { select: { name: true } } } },
                user: { select: { name: true } },
                cashier: { select: { name: true } },
                payments: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getOrderById(id) {
        if (!id || isNaN(id))
            return null;
        return this.prisma.order.findUnique({
            where: { id },
            include: {
                items: { include: { menuItem: true, preparedBy: { select: { name: true } } } },
                user: { select: { name: true } },
                cashier: { select: { name: true } },
                payments: true
            }
        });
    }
    async updateOrderStatus(id, status) {
        if (!id || isNaN(id))
            return null;
        return this.prisma.order.update({ where: { id }, data: { status } });
    }
    async updateOrderItemStatus(itemId, status, userId) {
        const data = { status };
        if (status === 'PREPARING') {
            data.preparingAt = new Date();
            data.preparedById = userId;
        }
        else if (status === 'READY') {
            data.readyAt = new Date();
            data.preparedById = userId;
        }
        else if (status === 'DELIVERED') {
            data.deliveredAt = new Date();
        }
        return this.prisma.orderItem.update({ where: { id: itemId }, data });
    }
    async updatePaymentStatus(id, paymentStatus, paymentMethod, splitPayments, cashierId) {
        if (!id || isNaN(id))
            return null;
        console.log(`[OrdersService] Finalizing payment for order ${id}. Cashier ID: ${cashierId}`);
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.order.update({
                where: { id },
                data: { paymentStatus, paymentMethod, cashierId }
            });
            if (paymentStatus === 'PAID') {
                await tx.splitPayment.deleteMany({ where: { orderId: id } });
                if (splitPayments && splitPayments.length > 0) {
                    await tx.splitPayment.createMany({
                        data: splitPayments.map(p => ({
                            orderId: id,
                            method: p.method,
                            amount: p.amount
                        }))
                    });
                }
                else if (paymentMethod) {
                    await tx.splitPayment.create({
                        data: {
                            orderId: id,
                            method: paymentMethod,
                            amount: order.totalAmount
                        }
                    });
                }
            }
            return order;
        });
    }
    async getInventoryReport(startDate, endDate) {
        const orderItems = await this.prisma.orderItem.findMany({
            where: {
                createdAt: { gte: startDate, lte: endDate },
                order: { status: { not: 'CANCELLED' } }
            },
            include: { menuItem: true }
        });
        const reportMap = new Map();
        orderItems.forEach(oi => {
            const existing = reportMap.get(oi.menuItemId) || {
                id: oi.menuItemId,
                name: oi.menuItem.name,
                type: oi.menuItem.type,
                sold: 0,
                revenue: 0,
                currentStock: oi.menuItem.trackStock ? oi.menuItem.stockQuantity : null
            };
            existing.sold += oi.quantity;
            existing.revenue += oi.quantity * oi.menuItem.price;
            reportMap.set(oi.menuItemId, existing);
        });
        return Array.from(reportMap.values());
    }
    async getDailySummary(cashierId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const wherePaid = {
            paymentStatus: 'PAID',
            updatedAt: { gte: today }
        };
        if (cashierId)
            wherePaid.cashierId = cashierId;
        const whereSplit = {
            createdAt: { gte: today }
        };
        if (cashierId) {
            whereSplit.order = {
                cashierId: cashierId
            };
        }
        const [paidToday, unpaidTotal, splitStats] = await Promise.all([
            this.prisma.order.aggregate({
                _sum: { totalAmount: true },
                where: wherePaid
            }),
            this.prisma.order.aggregate({
                _sum: { totalAmount: true },
                where: { paymentStatus: 'UNPAID' }
            }),
            this.prisma.splitPayment.groupBy({
                by: ['method'],
                _sum: { amount: true },
                where: whereSplit
            })
        ]);
        return {
            paidToday: paidToday._sum.totalAmount || 0,
            unpaidTotal: unpaidTotal._sum.totalAmount || 0,
            paymentMethodBreakdown: splitStats.map((stat) => ({
                method: stat.method,
                amount: stat._sum.amount || 0
            }))
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map