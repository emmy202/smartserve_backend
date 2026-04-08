import { PrismaService } from '../prisma/prisma.service';
import { ApprovalStatus, RequestType } from '@prisma/client';
export declare class RequestsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, type: RequestType, title: string, reason: string): Promise<any>;
    findAll(): Promise<any>;
    getMyRequests(userId: number): Promise<any>;
    updateStatus(id: number, status: ApprovalStatus): Promise<any>;
}
