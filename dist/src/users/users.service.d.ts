import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: any): Promise<{
        email: string;
        password: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        id: number;
    }[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__UserClient<{
        email: string;
        password: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    } | null, null, import(".prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findByEmail(email: string): import("@prisma/client").Prisma.Prisma__UserClient<{
        email: string;
        password: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    } | null, null, import(".prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateUserDto: UpdateUserDto): import("@prisma/client").Prisma.Prisma__UserClient<{
        email: string;
        password: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }, never, import(".prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__UserClient<{
        email: string;
        password: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }, never, import(".prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
