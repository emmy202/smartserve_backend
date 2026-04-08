import { PrismaService } from '../prisma/prisma.service';
export declare class MenuService {
    private prisma;
    constructor(prisma: PrismaService);
    createCategory(name: string): Promise<{
        name: string;
        id: number;
    }>;
    getCategories(): Promise<({
        items: {
            name: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            description: string | null;
            price: number;
            type: import("@prisma/client").$Enums.ItemType;
            available: boolean;
            stockQuantity: number;
            trackStock: boolean;
            categoryId: number;
        }[];
    } & {
        name: string;
        id: number;
    })[]>;
    createMenuItem(data: any): Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        description: string | null;
        price: number;
        type: import("@prisma/client").$Enums.ItemType;
        available: boolean;
        stockQuantity: number;
        trackStock: boolean;
        categoryId: number;
    }>;
    getMenuItems(): Promise<({
        category: {
            name: string;
            id: number;
        };
    } & {
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        description: string | null;
        price: number;
        type: import("@prisma/client").$Enums.ItemType;
        available: boolean;
        stockQuantity: number;
        trackStock: boolean;
        categoryId: number;
    })[]>;
    updateMenuItem(id: number, data: any): Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        description: string | null;
        price: number;
        type: import("@prisma/client").$Enums.ItemType;
        available: boolean;
        stockQuantity: number;
        trackStock: boolean;
        categoryId: number;
    }>;
    deleteMenuItem(id: number): Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        description: string | null;
        price: number;
        type: import("@prisma/client").$Enums.ItemType;
        available: boolean;
        stockQuantity: number;
        trackStock: boolean;
        categoryId: number;
    }>;
    getRecipe(menuItemId: number): Promise<any>;
    addRecipeItem(menuItemId: number, data: {
        inventoryItemId: number;
        quantityNeeded: number;
    }): Promise<any>;
    removeRecipeItem(id: number): Promise<any>;
}
