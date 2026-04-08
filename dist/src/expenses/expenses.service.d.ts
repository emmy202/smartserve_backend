import { PrismaService } from '../prisma/prisma.service';
export declare class ExpensesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, title: string, amount: number, category?: string, description?: string): Promise<{
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
    findByUser(userId: number): Promise<({
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
    updateStatus(id: number, status: any, decisionNote?: string): Promise<{
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
    delete(id: number): Promise<{
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
