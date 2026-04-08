"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let RoomsService = class RoomsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.room.create({ data });
    }
    async findAll() {
        return this.prisma.room.findMany();
    }
    async findOne(id) {
        return this.prisma.room.findUnique({ where: { id } });
    }
    async update(id, data, userId) {
        const currentRoom = await this.prisma.room.findUnique({ where: { id } });
        const isNewOccupancy = data.status === 'OCCUPIED' && currentRoom?.status !== 'OCCUPIED';
        const isClearing = data.status !== 'OCCUPIED' && currentRoom?.status === 'OCCUPIED';
        const updateData = {
            ...data,
            lastStatusChange: new Date()
        };
        if (isNewOccupancy) {
            updateData.currentCheckIn = new Date();
            if (!updateData.expectedCheckOut) {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(10, 0, 0, 0);
                updateData.expectedCheckOut = tomorrow;
            }
        }
        else if (isClearing) {
            updateData.currentCheckIn = null;
            updateData.expectedCheckOut = null;
        }
        const room = await this.prisma.room.update({ where: { id }, data: updateData });
        if (data.status && data.status !== currentRoom?.status) {
            await this.prisma.roomStatusLog.create({
                data: {
                    roomId: room.id,
                    oldStatus: currentRoom?.status,
                    newStatus: room.status,
                    userId: userId
                }
            });
        }
        if (isNewOccupancy) {
            let category = await this.prisma.menuCategory.findUnique({ where: { name: 'Accommodation' } });
            if (!category) {
                category = await this.prisma.menuCategory.create({ data: { name: 'Accommodation' } });
            }
            let menuItem = await this.prisma.menuItem.findFirst({
                where: { name: 'Room Stay', type: client_1.ItemType.ACCOMMODATION }
            });
            if (!menuItem) {
                menuItem = await this.prisma.menuItem.create({
                    data: {
                        name: 'Room Stay',
                        type: client_1.ItemType.ACCOMMODATION,
                        price: room.price,
                        categoryId: category.id
                    }
                });
            }
            await this.prisma.order.create({
                data: {
                    tableNumber: room.number,
                    totalAmount: room.price,
                    userId: userId,
                    paymentStatus: 'UNPAID',
                    status: 'COMPLETED',
                    createdAt: new Date(),
                    items: {
                        create: {
                            menuItemId: menuItem.id,
                            quantity: 1,
                            status: 'READY'
                        }
                    }
                }
            });
        }
        return room;
    }
    async getHistory(roomId) {
        return this.prisma.roomStatusLog.findMany({
            where: { roomId },
            include: {
                user: { select: { name: true, role: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async remove(id) {
        return this.prisma.room.delete({ where: { id } });
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map