import { RoomsService } from './rooms.service';
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    create(data: any): Promise<{
        number: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        price: number;
        type: string;
        status: import("@prisma/client").$Enums.RoomStatus;
        currentCheckIn: Date | null;
        expectedCheckOut: Date | null;
        lastStatusChange: Date | null;
    }>;
    findAll(): Promise<{
        number: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        price: number;
        type: string;
        status: import("@prisma/client").$Enums.RoomStatus;
        currentCheckIn: Date | null;
        expectedCheckOut: Date | null;
        lastStatusChange: Date | null;
    }[]>;
    findOne(id: string): Promise<{
        number: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        price: number;
        type: string;
        status: import("@prisma/client").$Enums.RoomStatus;
        currentCheckIn: Date | null;
        expectedCheckOut: Date | null;
        lastStatusChange: Date | null;
    } | null>;
    update(id: string, data: any, req: any): Promise<{
        number: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        price: number;
        type: string;
        status: import("@prisma/client").$Enums.RoomStatus;
        currentCheckIn: Date | null;
        expectedCheckOut: Date | null;
        lastStatusChange: Date | null;
    }>;
    getHistory(id: string): Promise<({
        user: {
            name: string;
            role: import("@prisma/client").$Enums.Role;
        };
    } & {
        createdAt: Date;
        id: number;
        userId: number;
        oldStatus: import("@prisma/client").$Enums.RoomStatus | null;
        newStatus: import("@prisma/client").$Enums.RoomStatus;
        roomId: number;
    })[]>;
    remove(id: string): Promise<{
        number: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        price: number;
        type: string;
        status: import("@prisma/client").$Enums.RoomStatus;
        currentCheckIn: Date | null;
        expectedCheckOut: Date | null;
        lastStatusChange: Date | null;
    }>;
}
