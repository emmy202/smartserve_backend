import { RequestsService } from './requests.service';
import { ApprovalStatus, RequestType } from '@prisma/client';
export declare class RequestsController {
    private readonly requestsService;
    constructor(requestsService: RequestsService);
    create(req: any, body: {
        type: RequestType;
        title: string;
        reason: string;
    }): Promise<any>;
    findAll(): Promise<any>;
    findMyRequests(req: any): Promise<any>;
    updateStatus(id: string, status: ApprovalStatus): Promise<any>;
}
