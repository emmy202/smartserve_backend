import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(startISO: string, endISO: string): Promise<{
        todaySales: number;
        actualSales: number;
        pendingSales: number;
        roomServiceSales: number;
        todayExpenses: any;
        todayRecipeCost: number;
        realProfit: number;
        revenueByTable: {
            table: string;
            revenue: number;
            count: number;
        }[];
        pendingRequests: any;
        roomStatus: any;
    }>;
    getKitchenSales(startISO: string, endISO: string): Promise<{
        totalRevenue: number;
        totalItemsSold: number;
        topItems: {
            count: number;
            revenue: number;
            name: string;
        }[];
        topStaff: {
            count: number;
            name: string;
        }[];
        avgPrepTime: number;
    }>;
    getSalesVsExpenses(startISO: string, endISO: string): Promise<{
        revenue: number;
        expense: number;
        procurement: number;
        recipeCost: number;
        totalOutflow: number;
        cashFlowProfit: number;
        realPerformanceProfit: number;
        breakdown: {
            expenses: any;
            sales: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.OrderGroupByOutputType, "paymentStatus"[]> & {
                _sum: {
                    totalAmount: number | null;
                };
            })[];
        };
    }>;
    getPeriodicLedger(type: 'DAILY' | 'MONTHLY', startISO: string, endISO: string): Promise<{
        paidRevenue: number;
        unpaidRevenue: number;
        generalExpense: number;
        procurementExpense: number;
        recipeCost: number;
        totalRevenue: number;
        totalExpense: number;
        profit: number;
        grossProfit: number;
        period: string;
    }[]>;
    getProfitAnalysis(startISO: string, endISO: string): Promise<{
        profit: number;
        margin: number;
        name: string;
        quantitySold: number;
        revenue: number;
        totalCost: number;
        unitPrice: number;
        unitCost: number;
    }[]>;
}
