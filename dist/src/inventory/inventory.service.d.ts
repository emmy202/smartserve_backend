import { PrismaService } from '../prisma/prisma.service';
export declare class InventoryService {
    private prisma;
    constructor(prisma: PrismaService);
    getSuppliers(): Promise<any>;
    createSupplier(data: any): Promise<any>;
    updateSupplier(id: number, data: any): Promise<any>;
    getItems(params: {
        category?: string;
        active?: boolean;
    }): Promise<any>;
    getLowStockItems(): Promise<any>;
    getItemById(id: number): Promise<any>;
    createItem(data: any): Promise<any>;
    updateItem(id: number, data: any): Promise<any>;
    recordMovement(data: {
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
    }): Promise<any>;
    getItemMovements(id: number): Promise<any>;
    getMovements(filters?: any): Promise<{
        data: any;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getDashboardStats(): Promise<{
        totalItems: any;
        lowStockItemsCount: any;
        outOfStockItems: any;
        totalStockValue: any;
        totalSupplierDebt: any;
        recentMovements: any;
        topDebts: any[];
        categorySummary: any[];
    }>;
    deleteMovement(id: number): Promise<any>;
    recordSupplierPayment(data: {
        supplierId: number;
        amount: number;
        method?: string;
        reference?: string;
        notes?: string;
        createdById: number;
    }): Promise<any>;
}
