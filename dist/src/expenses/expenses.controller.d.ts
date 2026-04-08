import { ExpensesService } from './expenses.service';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    create(req: any, body: {
        title: string;
        amount: number;
        category?: string;
        description?: string;
    }): Promise<{
        createdAt: Date;
        id: number;
        category: string;
        description: string | null;
        title: string;
        amount: number;
        status: import("@prisma/client").$Enums.ApprovalStatus;
        date: Date;
        reviewedAt: Date | null;
        decisionNote: string | null;
        userId: number;
    }>;
    findAll(): Promise<({
        user: {
            name: string;
            role: import("@prisma/client").$Enums.Role;
        };
    } & {
        createdAt: Date;
        id: number;
        category: string;
        description: string | null;
        title: string;
        amount: number;
        status: import("@prisma/client").$Enums.ApprovalStatus;
        date: Date;
        reviewedAt: Date | null;
        decisionNote: string | null;
        userId: number;
    })[]>;
    findByUser(req: any): Promise<({
        user: {
            name: string;
            role: import("@prisma/client").$Enums.Role;
        };
    } & {
        createdAt: Date;
        id: number;
        category: string;
        description: string | null;
        title: string;
        amount: number;
        status: import("@prisma/client").$Enums.ApprovalStatus;
        date: Date;
        reviewedAt: Date | null;
        decisionNote: string | null;
        userId: number;
    })[]>;
    updateStatus(id: string, body: {
        status: any;
        decisionNote?: string;
    }): Promise<{
        createdAt: Date;
        id: number;
        category: string;
        description: string | null;
        title: string;
        amount: number;
        status: import("@prisma/client").$Enums.ApprovalStatus;
        date: Date;
        reviewedAt: Date | null;
        decisionNote: string | null;
        userId: number;
    }>;
    delete(id: string): Promise<{
        createdAt: Date;
        id: number;
        category: string;
        description: string | null;
        title: string;
        amount: number;
        status: import("@prisma/client").$Enums.ApprovalStatus;
        date: Date;
        reviewedAt: Date | null;
        decisionNote: string | null;
        userId: number;
    }>;
}
