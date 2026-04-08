import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: number, tableNumber: string | null, items: { menuItemId: number, quantity: number }[]) {
    // Calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      if (!item.menuItemId) continue;
      const menuItem = await this.prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
      if (!menuItem) continue;
      
      // Check availability
      if (!(menuItem as any).available) {
        throw new Error(`Item ${menuItem.name} is currently out of stock/unavailable.`);
      }
      
      // Check stock quantity if tracked
      if ((menuItem as any).trackStock && (menuItem as any).stockQuantity < item.quantity) {
        throw new Error(`Only ${(menuItem as any).stockQuantity} units of ${menuItem.name} remaining in stock.`);
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

    // Post-processing: Deduct stock from Inventory based on Recipes
    for (const item of items) {
      // 1. Check for Recipes (Raw Material dependencies)
      const recipes = await (this.prisma as any).recipe.findMany({
        where: { menuItemId: item.menuItemId }
      });

      if (recipes.length > 0) {
        for (const recipe of recipes) {
          const qtyToDeduct = recipe.quantityNeeded * item.quantity;
          
          // Deduct from global inventory
          await (this.prisma as any).inventoryItem.update({
            where: { id: recipe.inventoryItemId },
            data: { currentStock: { decrement: qtyToDeduct } }
          });

          // Record as STOCK_OUT movement
          await (this.prisma as any).stockMovement.create({
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
      } else {
        // 2. Legacy Fallback: Update stock on MenuItem itself if trackStock is enabled
        const menuItem = await this.prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
        if (menuItem && (menuItem as any).trackStock) {
          const newQty = Math.max(0, (menuItem as any).stockQuantity - item.quantity);
          await this.prisma.menuItem.update({
            where: { id: menuItem.id },
            data: { 
              stockQuantity: newQty,
              available: newQty > 0
            } as any
          });
        }
      }
    }

    return order;
  }

  async addItemsToOrder(orderId: number, items: { menuItemId: number, quantity: number }[]) {
    let additionalAmount = 0;
    for (const item of items) {
      const menuItem = await this.prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
      if (!menuItem) continue;

      if (!(menuItem as any).available) {
        throw new Error(`Item ${menuItem.name} is currently out of stock.`);
      }

      if ((menuItem as any).trackStock && (menuItem as any).stockQuantity < item.quantity) {
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

    // Post-processing: Deduct stock from Inventory based on Recipes
    for (const item of items) {
      // 1. Check for Recipes (Raw Material dependencies)
      const recipes = await (this.prisma as any).recipe.findMany({
        where: { menuItemId: item.menuItemId }
      });

      if (recipes.length > 0) {
        for (const recipe of recipes) {
          const qtyToDeduct = recipe.quantityNeeded * item.quantity;
          
          // Deduct from global inventory
          await (this.prisma as any).inventoryItem.update({
            where: { id: recipe.inventoryItemId },
            data: { currentStock: { decrement: qtyToDeduct } }
          });

          // Record as STOCK_OUT movement
          await (this.prisma as any).stockMovement.create({
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
      } else {
        // 2. Legacy Fallback: Update stock on MenuItem itself if trackStock is enabled
        if (!item.menuItemId) continue;
        const menuItem = await this.prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
        if (menuItem && (menuItem as any).trackStock) {
          const newQty = Math.max(0, (menuItem as any).stockQuantity - item.quantity);
          await this.prisma.menuItem.update({
            where: { id: menuItem.id },
            data: { 
              stockQuantity: newQty,
              available: newQty > 0
            } as any
          });
        }
      }
    }

    return updatedOrder;
  }

  async getQueueItems(role: string, page: number = 1, limit: number = 10, type?: string) {
    const skip = (page - 1) * limit;
    
    let typeFilter = type;
    if (!typeFilter) {
      if (role === 'KITCHEN_STAFF') typeFilter = 'FOOD';
      if (role === 'BAR_STAFF') typeFilter = 'DRINK';
    }

    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    const where: any = {
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

  async getOrdersForCashier(cashierId: number) {
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

  async getOrdersByUser(userId: number) {
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

  async getOrderById(id: number) {
    if (!id || isNaN(id)) return null;
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

  async updateOrderStatus(id: number, status: any) {
    if (!id || isNaN(id)) return null;
    return this.prisma.order.update({ where: { id }, data: { status } });
  }

  async updateOrderItemStatus(itemId: number, status: any, userId: number) {
    const data: any = { status };
    if (status === 'PREPARING') {
      data.preparingAt = new Date();
      data.preparedById = userId;
    }
    else if (status === 'READY') {
      data.readyAt = new Date();
      // Always track who marked it ready
      data.preparedById = userId;
    }
    else if (status === 'DELIVERED') {
      data.deliveredAt = new Date();
    }

    return this.prisma.orderItem.update({ where: { id: itemId }, data });
  }

  async updatePaymentStatus(id: number, paymentStatus: any, paymentMethod?: string, splitPayments?: { method: string, amount: number }[], cashierId?: number) {
    if (!id || isNaN(id)) return null;

    console.log(`[OrdersService] Finalizing payment for order ${id}. Cashier ID: ${cashierId}`);
    return this.prisma.$transaction(async (tx) => {
      // 1. Update basic order payment status
      const order = await (tx as any).order.update({ 
        where: { id }, 
        data: { paymentStatus, paymentMethod, cashierId } 
      });

      // 2. Handle sub-payment records for auditing and reports
      if (paymentStatus === 'PAID') {
        // Clear old ones to prevent duplicates on re-payment
        await (tx as any).splitPayment.deleteMany({ where: { orderId: id } });

        if (splitPayments && splitPayments.length > 0) {
          await (tx as any).splitPayment.createMany({
            data: splitPayments.map(p => ({
              orderId: id,
              method: p.method,
              amount: p.amount
            }))
          });
        } else if (paymentMethod) {
          // Defaults to single payment if no split provided
          await (tx as any).splitPayment.create({
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

  async getInventoryReport(startDate: Date, endDate: Date) {
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
        currentStock: (oi.menuItem as any).trackStock ? (oi.menuItem as any).stockQuantity : null
      };
      existing.sold += oi.quantity;
      existing.revenue += oi.quantity * oi.menuItem.price;
      reportMap.set(oi.menuItemId, existing);
    });

    return Array.from(reportMap.values());
  }

  async getDailySummary(cashierId?: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const wherePaid: any = {
      paymentStatus: 'PAID',
      updatedAt: { gte: today }
    };
    if (cashierId) wherePaid.cashierId = cashierId;

    const whereSplit: any = {
      createdAt: { gte: today }
    };
    if (cashierId) {
      whereSplit.order = {
        cashierId: cashierId
      };
    }

    const [paidToday, unpaidTotal, splitStats] = await Promise.all([
      // 1. Total Paid Today
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: wherePaid
      }),
      // 2. Total Unpaid (All time)
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: 'UNPAID' }
      }),
      // 3. Breakdown by Payment Method from SplitPayment model (Source of Truth)
      (this.prisma as any).splitPayment.groupBy({
        by: ['method'],
        _sum: { amount: true },
        where: whereSplit
      })
    ]);

    return {
      paidToday: paidToday._sum.totalAmount || 0,
      unpaidTotal: unpaidTotal._sum.totalAmount || 0,
      paymentMethodBreakdown: splitStats.map((stat: any) => ({
        method: stat.method,
        amount: stat._sum.amount || 0
      }))
    };
  }
}
