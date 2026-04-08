import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getDashboardStats(start: string, end: string): Promise<{
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
    }> | {
        error: string;
    };
    getKitchenSales(start: string, end: string): Promise<{
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
    }> | {
        error: string;
    };
    getFinanceReport(start: string, end: string): Promise<{
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
    }> | {
        error: string;
    };
    getLedger(type: 'DAILY' | 'MONTHLY', start: string, end: string): Promise<{
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
    }[]> | {
        error: string;
    };
    getProfitAnalysis(start: string, end: string): Promise<{
        profit: number;
        margin: number;
        name: string;
        quantitySold: number;
        revenue: number;
        totalCost: number;
        unitPrice: number;
        unitCost: number;
    }[]> | {
        error: string;
    };
}
