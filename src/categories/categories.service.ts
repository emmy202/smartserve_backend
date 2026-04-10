import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryType } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; type: CategoryType }) {
    return this.prisma.category.create({ data });
  }

  async findAll(type?: CategoryType) {
    return this.prisma.category.findMany({
      where: type ? { type } : {},
      include: {
        _count: {
          select: {
            menuItems: true,
            inventoryItems: true,
            expenses: true,
            assets: true,
            rooms: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  async update(id: number, data: { name: string; type?: CategoryType }) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }
}
