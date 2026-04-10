import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  // --- Suppliers ---
  async getSuppliers() {
    const suppliers = await (this.prisma as any).supplier.findMany({
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

    return suppliers.map((s: any) => {
      let totalPurchases = 0;
      let totalStockPaid = 0; // paid at time of stock in

      s.stockMovements.forEach((m: any) => {
        const qty = Number(m.quantity) || 0;
        const cost = Number(m.unitCost) || 0;
        const paid = Number(m.paidAmount) || 0;
        
        totalPurchases += (qty * cost);
        totalStockPaid += paid;
      });

      const totalPayments = s.payments.reduce((acc: number, p: any) => acc + (Number(p.amount) || 0), 0);
      const totalPaid = totalStockPaid + totalPayments;
      const balance = totalPurchases - totalPaid;
      
      const { stockMovements, ...rest } = s;
      return { ...rest, totalPurchases, totalPaid, balance };
    });
  }

  async createSupplier(data: any) {
    return (this.prisma as any).supplier.create({ data });
  }

  async updateSupplier(id: number, data: any) {
    // Strip relations, IDs and computed fields to prevent Prisma update errors
    const { 
      id: _id, 
      createdAt, 
      updatedAt, 
      balance, 
      totalPurchases, 
      totalPaid, 
      payments,
      stockMovements,
      inventoryItems,
      ...cleanData 
    } = data;
    
    return (this.prisma as any).supplier.update({
      where: { id },
      data: cleanData
    });
  }

  // --- Inventory Items ---
  async getItems(params: { categoryId?: number; active?: boolean }) {
    const where: any = { active: params.active };
    if (params.categoryId) where.categoryId = +params.categoryId;

    return (this.prisma as any).inventoryItem.findMany({
      where,
      include: { 
        preferredSupplier: { select: { name: true } },
        category: { select: { name: true } }
      },
      orderBy: { name: 'asc' }
    });
  }

  async getLowStockItems() {
    const items = await (this.prisma as any).inventoryItem.findMany({
      where: { active: true },
      include: { preferredSupplier: true, category: true },
      orderBy: { currentStock: 'asc' }
    });
    return items.filter((item: any) => item.currentStock <= item.minimumStock);
  }

  async getItemById(id: number) {
    return (this.prisma as any).inventoryItem.findUnique({
      where: { id },
      include: { 
        preferredSupplier: true,
        category: true,
        movements: { 
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: { createdBy: { select: { name: true } } }
        }
      }
    });
  }

  async createItem(data: any) {
    return (this.prisma as any).inventoryItem.create({ data });
  }

  async updateItem(id: number, data: any) {
    const { id: _id, createdAt, updatedAt, preferredSupplier, category, ...cleanData } = data;
    return (this.prisma as any).inventoryItem.update({
      where: { id },
      data: cleanData
    });
  }

  // --- Stock Movements ---
  async recordMovement(data: {
    inventoryItemId: number;
    type: any;
    quantity: number;
    unitCost?: number;
    reason?: string;
    referenceType?: string;
    referenceId?: string;
    supplierId?: number;
    createdById: number;
    paymentStatus?: any;
    paidAmount?: number;
    paymentMethod?: string;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const item = await (tx as any).inventoryItem.findUnique({
        where: { id: data.inventoryItemId }
      });

      if (!item) throw new Error('Item not found');

      // Determine payment status based on amount entered
      let paymentStatus = data.paymentStatus || 'PAID';
      if (data.type === 'STOCK_IN' && data.unitCost) {
        const totalCost = data.quantity * data.unitCost;
        if ((data.paidAmount || 0) < totalCost) {
          paymentStatus = 'UNPAID';
        } else {
          paymentStatus = 'PAID';
        }
      }

      // 1. Create movement record
      const movement = await (tx as any).stockMovement.create({
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

      // 2. Adjust current stock
      let newStock = item.currentStock;
      if (data.type === 'STOCK_IN' || data.type === 'ADJUSTMENT') {
        newStock += data.quantity;
      } else if (data.type === 'STOCK_OUT' || data.type === 'WASTAGE') {
        newStock -= data.quantity;
      }

      await (tx as any).inventoryItem.update({
        where: { id: data.inventoryItemId },
        data: { currentStock: newStock }
      });

      return movement;
    });
  }

  async getItemMovements(id: number) {
    return (this.prisma as any).stockMovement.findMany({
      where: { inventoryItemId: id },
      include: { 
        createdBy: { select: { name: true } },
        supplier: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  }

  async getMovements(filters: any = {}) {
    const page = filters.page ? +filters.page : 1;
    const limit = filters.limit ? +filters.limit : 50;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.type && filters.type !== 'ALL') where.type = filters.type;
    if (filters.inventoryItemId) where.inventoryItemId = +filters.inventoryItemId;

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
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
      (this.prisma as any).stockMovement.findMany({
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
      (this.prisma as any).stockMovement.count({ where })
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  // --- Dashboard & KPIs ---
  async getDashboardStats() {
    const [totalItems, lowStockItems, outOfStockItems, items, suppliers] = await Promise.all([
      (this.prisma as any).inventoryItem.count({ where: { active: true } }),
      (this.prisma as any).inventoryItem.findMany({
        where: { 
          active: true,
          currentStock: { lte: (this.prisma as any).inventoryItem.fields?.minimumStock || 0 }
        }
      }),
      (this.prisma as any).inventoryItem.count({ where: { active: true, currentStock: 0 } }),
      (this.prisma as any).inventoryItem.findMany({ where: { active: true } }),
      this.getSuppliers()
    ]);

    const totalStockValue = items.reduce((acc: number, item: any) => acc + (item.currentStock * item.costPrice), 0);
    const totalSupplierDebt = (suppliers as any[]).reduce((acc: number, s: any) => acc + (s.balance || 0), 0);

    const recentMovementsResponse = await this.getMovements({ limit: 10 });
    const recentMovements = recentMovementsResponse.data;

    // Category summary
    const categoriesMap = new Map();
    items.forEach((item: any) => {
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
      topDebts: (suppliers as any[]).filter(s => s.balance > 0).sort((a, b) => b.balance - a.balance).slice(0, 5),
      categorySummary: Array.from(categoriesMap.entries()).map(([name, stats]) => ({ name, ...stats }))
    };
  }

  async deleteMovement(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const movement = await (tx as any).stockMovement.findUnique({
        where: { id },
        include: { inventoryItem: true }
      });

      if (!movement) throw new Error('Movement not found');

      // 1. Reverse the impact on current stock
      let stockDelta = 0;
      if (movement.type === 'STOCK_IN' || movement.type === 'ADJUSTMENT') {
        stockDelta = -movement.quantity; // Was added, now remove
      } else if (movement.type === 'STOCK_OUT' || movement.type === 'WASTAGE') {
        stockDelta = movement.quantity; // Was removed, now add back
      }

      await (tx as any).inventoryItem.update({
        where: { id: movement.inventoryItemId },
        data: { currentStock: { increment: stockDelta } }
      });

      // 2. Delete the record
      return (tx as any).stockMovement.delete({ where: { id } });
    });
  }

  async recordSupplierPayment(data: {
    supplierId: number;
    amount: number;
    method?: string;
    reference?: string;
    notes?: string;
    createdById: number;
  }) {
    return (this.prisma as any).supplierPayment.create({
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
}
