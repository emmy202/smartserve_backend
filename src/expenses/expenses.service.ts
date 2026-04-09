import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, title: string, amount: number, category: string = 'General', description?: string) {
    return this.prisma.expense.create({
      data: { 
        userId,
        title, 
        amount, 
        category, 
        description,
        status: 'PENDING'
      }
    });
  }

  async findAll(start?: string, end?: string) {
    const where: any = {};
    if (start && end) {
      where.createdAt = {
        gte: new Date(start),
        lte: new Date(end)
      };
    }
    return this.prisma.expense.findMany({
      where,
      include: { user: { select: { name: true, role: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByUser(userId: number) {
    return this.prisma.expense.findMany({
      where: { userId },
      include: { user: { select: { name: true, role: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateStatus(id: number, status: any, decisionNote?: string) {
    return this.prisma.expense.update({
      where: { id },
      data: { 
        status, 
        decisionNote,
        reviewedAt: new Date()
      }
    });
  }

  async delete(id: number) {
    return this.prisma.expense.delete({
      where: { id }
    });
  }
}
