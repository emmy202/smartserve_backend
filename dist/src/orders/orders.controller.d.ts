import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(req: any, body: {
        tableNumber: string;
        items: {
            menuItemId: number;
            quantity: number;
        }[];
    }): Promise<{
        items: ({
            menuItem: {
                createdAt: Date;
                updatedAt: Date;
                id: number;
                name: string;
                description: string | null;
                price: number;
                type: import("@prisma/client").$Enums.ItemType;
                categoryId: number;
                available: boolean;
                stockQuantity: number;
                trackStock: boolean;
            };
        } & {
            status: import("@prisma/client").$Enums.OrderItemStatus;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            quantity: number;
            preparingAt: Date | null;
            readyAt: Date | null;
            deliveredAt: Date | null;
            menuItemId: number;
            preparedById: number | null;
            orderId: number;
        })[];
    } & {
        tableNumber: string | null;
        totalAmount: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        paymentMethod: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        cashierId: number | null;
    }>;
    addItems(id: number, body: {
        items: {
            menuItemId: number;
            quantity: number;
        }[];
    }): Promise<{
        items: ({
            menuItem: {
                createdAt: Date;
                updatedAt: Date;
                id: number;
                name: string;
                description: string | null;
                price: number;
                type: import("@prisma/client").$Enums.ItemType;
                categoryId: number;
                available: boolean;
                stockQuantity: number;
                trackStock: boolean;
            };
        } & {
            status: import("@prisma/client").$Enums.OrderItemStatus;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            quantity: number;
            preparingAt: Date | null;
            readyAt: Date | null;
            deliveredAt: Date | null;
            menuItemId: number;
            preparedById: number | null;
            orderId: number;
        })[];
    } & {
        tableNumber: string | null;
        totalAmount: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        paymentMethod: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        cashierId: number | null;
    }>;
    getQueue(req: any, page?: string, limit?: string, type?: string): Promise<{
        data: ({
            menuItem: {
                createdAt: Date;
                updatedAt: Date;
                id: number;
                name: string;
                description: string | null;
                price: number;
                type: import("@prisma/client").$Enums.ItemType;
                categoryId: number;
                available: boolean;
                stockQuantity: number;
                trackStock: boolean;
            };
            preparedBy: {
                name: string;
            } | null;
            order: {
                user: {
                    name: string;
                };
            } & {
                tableNumber: string | null;
                totalAmount: number;
                status: import("@prisma/client").$Enums.OrderStatus;
                paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
                paymentMethod: string | null;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                userId: number;
                cashierId: number | null;
            };
        } & {
            status: import("@prisma/client").$Enums.OrderItemStatus;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            quantity: number;
            preparingAt: Date | null;
            readyAt: Date | null;
            deliveredAt: Date | null;
            menuItemId: number;
            preparedById: number | null;
            orderId: number;
        })[];
        meta: {
            total: number;
            pendingTotal: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findAll(req: any): Promise<({
        user: {
            name: string;
        };
        cashier: {
            name: string;
        } | null;
        items: ({
            menuItem: {
                createdAt: Date;
                updatedAt: Date;
                id: number;
                name: string;
                description: string | null;
                price: number;
                type: import("@prisma/client").$Enums.ItemType;
                categoryId: number;
                available: boolean;
                stockQuantity: number;
                trackStock: boolean;
            };
            preparedBy: {
                name: string;
            } | null;
        } & {
            status: import("@prisma/client").$Enums.OrderItemStatus;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            quantity: number;
            preparingAt: Date | null;
            readyAt: Date | null;
            deliveredAt: Date | null;
            menuItemId: number;
            preparedById: number | null;
            orderId: number;
        })[];
        payments: {
            createdAt: Date;
            id: number;
            orderId: number;
            method: string;
            amount: number;
        }[];
    } & {
        tableNumber: string | null;
        totalAmount: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        paymentMethod: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        cashierId: number | null;
    })[]>;
    getDailySummary(req: any): Promise<{
        paidToday: number;
        unpaidTotal: number;
        paymentMethodBreakdown: any;
    }>;
    getInventoryReport(start: string, end: string): Promise<any[]>;
    updateStatus(id: number, status: any): Promise<{
        tableNumber: string | null;
        totalAmount: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        paymentMethod: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        cashierId: number | null;
    } | null>;
    updateItemStatus(req: any, itemId: number, status: any): Promise<{
        status: import("@prisma/client").$Enums.OrderItemStatus;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        quantity: number;
        preparingAt: Date | null;
        readyAt: Date | null;
        deliveredAt: Date | null;
        menuItemId: number;
        preparedById: number | null;
        orderId: number;
    }>;
    updatePayment(req: any, id: number, body: {
        paymentStatus: any;
        paymentMethod?: string;
        splitPayments?: {
            method: string;
            amount: number;
        }[];
    }): Promise<any>;
    findOne(id: number): Promise<({
        user: {
            name: string;
        };
        cashier: {
            name: string;
        } | null;
        items: ({
            menuItem: {
                createdAt: Date;
                updatedAt: Date;
                id: number;
                name: string;
                description: string | null;
                price: number;
                type: import("@prisma/client").$Enums.ItemType;
                categoryId: number;
                available: boolean;
                stockQuantity: number;
                trackStock: boolean;
            };
            preparedBy: {
                name: string;
            } | null;
        } & {
            status: import("@prisma/client").$Enums.OrderItemStatus;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            quantity: number;
            preparingAt: Date | null;
            readyAt: Date | null;
            deliveredAt: Date | null;
            menuItemId: number;
            preparedById: number | null;
            orderId: number;
        })[];
        payments: {
            createdAt: Date;
            id: number;
            orderId: number;
            method: string;
            amount: number;
        }[];
    } & {
        tableNumber: string | null;
        totalAmount: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        paymentMethod: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        cashierId: number | null;
    }) | null>;
}
