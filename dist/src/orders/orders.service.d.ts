import { PrismaService } from '../prisma/prisma.service';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    createOrder(userId: number, tableNumber: string | null, items: {
        menuItemId: number;
        quantity: number;
    }[]): Promise<{
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
    addItemsToOrder(orderId: number, items: {
        menuItemId: number;
        quantity: number;
    }[]): Promise<{
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
    getQueueItems(role: string, page?: number, limit?: number, type?: string): Promise<{
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
    getOrders(): Promise<({
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
    getOrdersForCashier(cashierId: number): Promise<({
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
    getOrdersByUser(userId: number): Promise<({
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
    getOrderById(id: number): Promise<({
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
    updateOrderStatus(id: number, status: any): Promise<{
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
    updateOrderItemStatus(itemId: number, status: any, userId: number): Promise<{
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
    updatePaymentStatus(id: number, paymentStatus: any, paymentMethod?: string, splitPayments?: {
        method: string;
        amount: number;
    }[], cashierId?: number): Promise<any>;
    getInventoryReport(startDate: Date, endDate: Date): Promise<any[]>;
    getDailySummary(cashierId?: number): Promise<{
        paidToday: number;
        unpaidTotal: number;
        paymentMethodBreakdown: any;
    }>;
}
