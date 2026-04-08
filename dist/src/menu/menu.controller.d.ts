import { MenuService } from './menu.service';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
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
    updateMenuItem(id: string, data: any): Promise<{
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
    deleteMenuItem(id: string): Promise<{
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
    getRecipe(id: string): Promise<any>;
    addRecipeItem(id: string, data: any): Promise<any>;
    removeRecipeItem(id: string): Promise<any>;
}
