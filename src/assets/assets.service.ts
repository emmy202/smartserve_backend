import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.asset.findMany({
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    if (!id || isNaN(id)) return null;
    return this.prisma.asset.findUnique({
      where: { id },
    });
  }

  async create(data: any) {
    return this.prisma.asset.create({
      data: {
        ...data,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
        lastMaintenance: data.lastMaintenance ? new Date(data.lastMaintenance) : null,
        nextMaintenance: data.nextMaintenance ? new Date(data.nextMaintenance) : null,
      },
    });
  }

  async update(id: number, data: any) {
    const { id: _, ...rest } = data;
    
    // Explicitly handle dates to ensure they are either real Dates, null (cleared), or undefined (no change)
    const prepareDate = (val: any) => {
      if (val === null || val === '') return null;
      if (val) {
        const d = new Date(val);
        return isNaN(d.getTime()) ? undefined : d;
      }
      return undefined;
    };

    const purchaseDate = prepareDate(data.purchaseDate);
    const lastMaintenance = prepareDate(data.lastMaintenance);
    const nextMaintenance = prepareDate(data.nextMaintenance);

    // Remove the date fields from rest to avoid conflicts
    const { purchaseDate: p, lastMaintenance: l, nextMaintenance: n, ...cleanData } = rest;

    if (!id || isNaN(id)) return null;

    return this.prisma.asset.update({
      where: { id },
      data: {
        ...cleanData,
        purchaseDate,
        lastMaintenance,
        nextMaintenance,
      },
    });
  }

  async remove(id: number) {
    if (!id || isNaN(id)) return null;
    return this.prisma.asset.delete({
      where: { id },
    });
  }

  async getStats() {
    const [total, operational, maintenance, repair] = await Promise.all([
      this.prisma.asset.count(),
      this.prisma.asset.count({ where: { status: 'OPERATIONAL' } }),
      this.prisma.asset.count({ where: { status: 'MAINTENANCE' } }),
      this.prisma.asset.count({ where: { status: 'REPAIR' } }),
    ]);

    const totalValue = await this.prisma.asset.aggregate({
      _sum: { purchasePrice: true },
    });

    return {
      total,
      operational,
      maintenance,
      repair,
      totalValue: totalValue._sum.purchasePrice || 0,
    };
  }
}
