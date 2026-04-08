import { InventoryService } from './inventory.service';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
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
    getSuppliers(): Promise<any>;
    createSupplier(data: any): Promise<any>;
    updateSupplier(id: string, data: any): Promise<any>;
    recordPayment(data: any, req: any): Promise<any>;
    getItems(category?: string, active?: string): Promise<any>;
    getLowStockItems(): Promise<any>;
    getItemById(id: string): Promise<any>;
    getItemMovements(id: string): Promise<any>;
    createItem(data: any): Promise<any>;
    updateItem(id: string, data: any): Promise<any>;
    recordMovement(data: any, req: any): Promise<any>;
    getMovements(query: any): Promise<{
        data: any;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    deleteMovement(id: string): Promise<any>;
}
