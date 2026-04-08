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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReportsService = class ReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats(startISO, endISO) {
        const start = new Date(startISO);
        const end = new Date(endISO);
        const paidSales = await this.prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: {
                createdAt: { gte: start, lte: end },
                paymentStatus: 'PAID'
            }
        });
        const unpaidSales = await this.prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: {
                createdAt: { gte: start, lte: end },
                paymentStatus: 'UNPAID'
            }
        });
        const expenses = await this.prisma.expense.aggregate({
            _sum: { amount: true },
            where: {
                createdAt: { gte: start, lte: end }
            }
        });
        const pendingRequests = await this.prisma.staffRequest.count({
            where: { status: 'PENDING' }
        });
        const roomStatus = await this.prisma.room.groupBy({
            by: ['status'],
            _count: true
        });
        const roomServiceSalesQuery = await this.prisma.orderItem.aggregate({
            _sum: { quantity: true },
            where: {
                menuItem: { type: 'ROOM_SERVICE' },
                createdAt: { gte: start, lte: end },
                order: { status: { not: 'CANCELLED' } }
            }
        });
        const roomServiceItems = await this.prisma.orderItem.findMany({
            where: {
                createdAt: { gte: start, lte: end },
                order: { status: { not: 'CANCELLED' } }
            },
            include: {
                menuItem: {
                    include: {
                        recipes: { include: { inventoryItem: true } }
                    }
                }
            }
        });
        const roomServiceSales = roomServiceItems
            .filter((i) => i.menuItem.type === 'ROOM_SERVICE')
            .reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
        const totalRecipeCost = roomServiceItems.reduce((sum, item) => {
            const itemRecipeCost = item.menuItem.recipes?.reduce((rSum, r) => rSum + (r.quantityNeeded * (r.inventoryItem?.costPrice || 0)), 0) || 0;
            return sum + (itemRecipeCost * item.quantity);
        }, 0);
        const actualSales = paidSales._sum.totalAmount || 0;
        const pendingSales = unpaidSales._sum.totalAmount || 0;
        const todayExpenses = expenses._sum.amount || 0;
        const todaySales = actualSales + pendingSales;
        const tableSales = await this.prisma.order.groupBy({
            by: ['tableNumber'],
            _sum: { totalAmount: true },
            _count: { tableNumber: true },
            where: {
                createdAt: { gte: start, lte: end },
                status: { not: 'CANCELLED' }
            }
        });
        const revenueByTable = tableSales
            .map(t => ({
            table: t.tableNumber || 'N/A',
            revenue: t._sum.totalAmount || 0,
            count: t._count.tableNumber || 1
        }))
            .sort((a, b) => b.revenue - a.revenue);
        return {
            todaySales,
            actualSales,
            pendingSales,
            roomServiceSales,
            todayExpenses,
            todayRecipeCost: totalRecipeCost,
            realProfit: todaySales - (totalRecipeCost + todayExpenses),
            revenueByTable,
            pendingRequests,
            roomStatus: roomStatus.reduce((acc, curr) => ({ ...acc, [curr.status]: curr._count }), {})
        };
    }
    async getKitchenSales(startISO, endISO) {
        const start = new Date(startISO);
        const end = new Date(endISO);
        const items = await this.prisma.orderItem.findMany({
            where: {
                menuItem: { type: 'FOOD' },
                order: { status: { not: 'CANCELLED' } },
                createdAt: { gte: start, lte: end }
            },
            include: {
                menuItem: true,
                preparedBy: true
            }
        });
        let totalRevenue = 0;
        const itemMap = new Map();
        const staffMap = new Map();
        for (const item of items) {
            const revenue = item.menuItem.price * item.quantity;
            totalRevenue += revenue;
            const name = item.menuItem.name;
            if (!itemMap.has(name))
                itemMap.set(name, { count: 0, revenue: 0 });
            const stat = itemMap.get(name);
            stat.count += item.quantity;
            stat.revenue += revenue;
            if (item.preparedBy?.name) {
                const staffName = item.preparedBy.name;
                if (!staffMap.has(staffName))
                    staffMap.set(staffName, { count: 0 });
                staffMap.get(staffName).count += item.quantity;
            }
        }
        const topItems = Array.from(itemMap.entries())
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.revenue - a.revenue);
        const topStaff = Array.from(staffMap.entries())
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.count - a.count);
        const prepTimes = items
            .filter(i => i.createdAt && i.readyAt)
            .map(i => {
            const start = new Date(i.createdAt).getTime();
            const end = new Date(i.readyAt).getTime();
            return (end - start) / (1000 * 60);
        });
        const avgPrepTime = prepTimes.length > 0
            ? prepTimes.reduce((a, b) => a + b, 0) / prepTimes.length
            : 0;
        return {
            totalRevenue,
            totalItemsSold: items.reduce((sum, i) => sum + i.quantity, 0),
            topItems,
            topStaff,
            avgPrepTime: Math.round(avgPrepTime * 10) / 10
        };
    }
    async getSalesVsExpenses(startISO, endISO) {
        const start = new Date(startISO);
        const end = new Date(endISO);
        const salesAgg = await this.prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: {
                createdAt: { gte: start, lte: end },
                status: { not: 'CANCELLED' }
            }
        });
        const expensesAgg = await this.prisma.expense.aggregate({
            _sum: { amount: true },
            where: {
                createdAt: { gte: start, lte: end }
            }
        });
        const stockPayments = await this.prisma.stockMovement.aggregate({
            _sum: { paidAmount: true },
            where: {
                type: 'STOCK_IN',
                createdAt: { gte: start, lte: end }
            }
        });
        const supplierPayments = await this.prisma.supplierPayment.aggregate({
            _sum: { amount: true },
            where: {
                createdAt: { gte: start, lte: end }
            }
        });
        const totalSales = Number(salesAgg._sum.totalAmount || 0);
        const totalGeneralExpenses = Number(expensesAgg._sum.amount || 0);
        const totalProcurementOutflow = Number(stockPayments._sum.paidAmount || 0) + Number(supplierPayments._sum.amount || 0);
        const orderItems = await this.prisma.orderItem.findMany({
            where: {
                createdAt: { gte: start, lte: end },
                order: { status: { not: 'CANCELLED' } }
            },
            include: {
                menuItem: {
                    include: {
                        recipes: {
                            include: { inventoryItem: true }
                        }
                    }
                }
            }
        });
        const totalRecipeCost = orderItems.reduce((sum, item) => {
            const itemRecipeCost = item.menuItem.recipes.reduce((rSum, r) => rSum + (r.quantityNeeded * (r.inventoryItem?.costPrice || 0)), 0);
            return sum + (itemRecipeCost * item.quantity);
        }, 0);
        const cashFlowProfit = totalSales - (totalGeneralExpenses + totalProcurementOutflow);
        const realPerformanceProfit = totalSales - (totalRecipeCost + totalGeneralExpenses);
        const expensesByCategory = await this.prisma.expense.groupBy({
            by: ['category'],
            _sum: { amount: true },
            where: { createdAt: { gte: start, lte: end } }
        });
        const salesByStatus = await this.prisma.order.groupBy({
            by: ['paymentStatus'],
            _sum: { totalAmount: true },
            where: { createdAt: { gte: start, lte: end }, status: { not: 'CANCELLED' } }
        });
        return {
            revenue: totalSales,
            expense: totalGeneralExpenses,
            procurement: totalProcurementOutflow,
            recipeCost: totalRecipeCost,
            totalOutflow: totalGeneralExpenses + totalProcurementOutflow,
            cashFlowProfit,
            realPerformanceProfit,
            breakdown: {
                expenses: expensesByCategory,
                sales: salesByStatus
            }
        };
    }
    async getPeriodicLedger(type, startISO, endISO) {
        const start = new Date(startISO);
        const end = new Date(endISO);
        const ledger = {};
        const getPeriodKey = (date) => {
            if (type === 'DAILY')
                return date.toISOString().split('T')[0];
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        };
        const initEntry = (key) => {
            if (!ledger[key]) {
                ledger[key] = {
                    paidRevenue: 0,
                    unpaidRevenue: 0,
                    generalExpense: 0,
                    procurementExpense: 0,
                    recipeCost: 0,
                    totalRevenue: 0,
                    totalExpense: 0,
                    profit: 0,
                    grossProfit: 0
                };
            }
        };
        const orders = await this.prisma.order.findMany({
            where: { createdAt: { gte: start, lte: end }, status: { not: 'CANCELLED' } },
            include: {
                items: {
                    include: {
                        menuItem: {
                            include: {
                                recipes: {
                                    include: { inventoryItem: true }
                                }
                            }
                        }
                    }
                }
            }
        });
        orders.forEach((o) => {
            const key = getPeriodKey(o.createdAt);
            initEntry(key);
            if (o.paymentStatus === 'PAID')
                ledger[key].paidRevenue += o.totalAmount;
            else
                ledger[key].unpaidRevenue += o.totalAmount;
            ledger[key].totalRevenue += o.totalAmount;
            o.items.forEach((item) => {
                const itemRecipeCost = item.menuItem.recipes.reduce((sum, recipe) => {
                    return sum + (recipe.quantityNeeded * (recipe.inventoryItem?.costPrice || 0));
                }, 0);
                ledger[key].recipeCost += (itemRecipeCost * item.quantity);
            });
        });
        const expenses = await this.prisma.expense.findMany({
            where: { createdAt: { gte: start, lte: end } },
            select: { amount: true, createdAt: true }
        });
        expenses.forEach((e) => {
            const key = getPeriodKey(e.createdAt);
            initEntry(key);
            ledger[key].generalExpense += e.amount;
            ledger[key].totalExpense += e.amount;
        });
        const stockOutflows = await this.prisma.stockMovement.findMany({
            where: { type: 'STOCK_IN', createdAt: { gte: start, lte: end } },
            select: { paidAmount: true, createdAt: true }
        });
        stockOutflows.forEach((s) => {
            const key = getPeriodKey(s.createdAt);
            initEntry(key);
            ledger[key].procurementExpense += (s.paidAmount || 0);
            ledger[key].totalExpense += (s.paidAmount || 0);
        });
        const supplierPayments = await this.prisma.supplierPayment.findMany({
            where: { createdAt: { gte: start, lte: end } },
            select: { amount: true, createdAt: true }
        });
        supplierPayments.forEach((p) => {
            const key = getPeriodKey(p.createdAt);
            initEntry(key);
            ledger[key].procurementExpense += p.amount;
            ledger[key].totalExpense += p.amount;
        });
        Object.keys(ledger).forEach(key => {
            ledger[key].profit = ledger[key].totalRevenue - ledger[key].totalExpense;
            ledger[key].grossProfit = ledger[key].totalRevenue - ledger[key].recipeCost;
        });
        return Object.entries(ledger)
            .map(([period, data]) => ({ period, ...data }))
            .sort((a, b) => b.period.localeCompare(a.period));
    }
    async getProfitAnalysis(startISO, endISO) {
        const start = new Date(startISO);
        const end = new Date(endISO);
        const orderItems = await this.prisma.orderItem.findMany({
            where: {
                createdAt: { gte: start, lte: end },
                order: { status: { not: 'CANCELLED' } }
            },
            include: {
                menuItem: {
                    include: {
                        recipes: {
                            include: { inventoryItem: true }
                        }
                    }
                }
            }
        });
        const analysisMap = new Map();
        for (const item of orderItems) {
            if (!analysisMap.has(item.menuItemId)) {
                const unitCost = item.menuItem.recipes.reduce((sum, recipe) => {
                    return sum + (recipe.quantityNeeded * (recipe.inventoryItem?.costPrice || 0));
                }, 0);
                analysisMap.set(item.menuItemId, {
                    name: item.menuItem.name,
                    quantitySold: 0,
                    revenue: 0,
                    totalCost: 0,
                    unitPrice: item.menuItem.price,
                    unitCost: unitCost
                });
            }
            const stats = analysisMap.get(item.menuItemId);
            stats.quantitySold += item.quantity;
            stats.revenue += (item.menuItem.price * item.quantity);
            stats.totalCost += (stats.unitCost * item.quantity);
        }
        return Array.from(analysisMap.values())
            .map(item => ({
            ...item,
            profit: item.revenue - item.totalCost,
            margin: item.revenue > 0 ? ((item.revenue - item.totalCost) / item.revenue) * 100 : 0
        }))
            .sort((a, b) => b.profit - a.profit);
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map