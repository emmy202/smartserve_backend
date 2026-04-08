import { PrismaService } from '../prisma/prisma.service';
export declare class RoomsService {
    private prisma;
    constructor(prisma: PrismaService);
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
    findOne(id: number): Promise<{
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
    update(id: number, data: any, userId: number): Promise<{
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
    getHistory(roomId: number): Promise<({
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
    remove(id: number): Promise<{
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
