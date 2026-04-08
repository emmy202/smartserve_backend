import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ItemType } from '@prisma/client';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.room.create({ data });
  }

  async findAll() {
    return this.prisma.room.findMany();
  }

  async findOne(id: number) {
    return this.prisma.room.findUnique({ where: { id } });
  }

  async update(id: number, data: any, userId: number) {
    const currentRoom = await this.prisma.room.findUnique({ where: { id } });
    const isNewOccupancy = data.status === 'OCCUPIED' && currentRoom?.status !== 'OCCUPIED';
    const isClearing = data.status !== 'OCCUPIED' && currentRoom?.status === 'OCCUPIED';

    const updateData: any = { 
      ...data, 
      lastStatusChange: new Date() 
    };

    if (isNewOccupancy) {
      updateData.currentCheckIn = new Date();
      // If expectedCheckOut isn't provided, default to tomorrow
      if (!updateData.expectedCheckOut) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0); // Standard 10 AM checkout
        updateData.expectedCheckOut = tomorrow;
      }
    } else if (isClearing) {
      updateData.currentCheckIn = null;
      updateData.expectedCheckOut = null;
    }

    const room = await this.prisma.room.update({ where: { id }, data: updateData });

    // ONLY log the movement if the status actually changed
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
      // Ensure we have an Accommodation category
      let category = await this.prisma.menuCategory.findUnique({ where: { name: 'Accommodation' } });
      if (!category) {
        category = await this.prisma.menuCategory.create({ data: { name: 'Accommodation' } });
      }

      // Ensure we have a Room Stay menu item
      let menuItem = await this.prisma.menuItem.findFirst({ 
        where: { name: 'Room Stay', type: ItemType.ACCOMMODATION } 
      });
      
      if (!menuItem) {
        menuItem = await this.prisma.menuItem.create({
          data: {
            name: 'Room Stay',
            type: ItemType.ACCOMMODATION,
            price: room.price,
            categoryId: category.id
          }
        });
      }

      // Create a revenue event for this room check-in with a detailed item
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

  async getHistory(roomId: number) {
    return this.prisma.roomStatusLog.findMany({
      where: { roomId },
      include: {
        user: { select: { name: true, role: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async remove(id: number) {
    return this.prisma.room.delete({ where: { id } });
  }
}
