import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApprovalStatus, RequestType } from '@prisma/client';

@Injectable()
export class RequestsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, type: RequestType, title: string, reason: string) {
    return (this.prisma as any).staffRequest.create({
      data: { type, title, reason, userId }
    });
  }

  async findAll() {
    return (this.prisma as any).staffRequest.findMany({
      include: { user: { select: { name: true, role: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getMyRequests(userId: number) {
    return (this.prisma as any).staffRequest.findMany({
      where: { userId },
      include: { user: { select: { name: true, role: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: number, status: ApprovalStatus) {
    return (this.prisma as any).staffRequest.update({
      where: { id },
      data: { status }
    });
  }
}
