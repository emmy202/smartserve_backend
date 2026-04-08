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
exports.AssetsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AssetsService = class AssetsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.asset.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        if (!id || isNaN(id))
            return null;
        return this.prisma.asset.findUnique({
            where: { id },
        });
    }
    async create(data) {
        return this.prisma.asset.create({
            data: {
                ...data,
                purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
                lastMaintenance: data.lastMaintenance ? new Date(data.lastMaintenance) : null,
                nextMaintenance: data.nextMaintenance ? new Date(data.nextMaintenance) : null,
            },
        });
    }
    async update(id, data) {
        const { id: _, ...rest } = data;
        const prepareDate = (val) => {
            if (val === null || val === '')
                return null;
            if (val) {
                const d = new Date(val);
                return isNaN(d.getTime()) ? undefined : d;
            }
            return undefined;
        };
        const purchaseDate = prepareDate(data.purchaseDate);
        const lastMaintenance = prepareDate(data.lastMaintenance);
        const nextMaintenance = prepareDate(data.nextMaintenance);
        const { purchaseDate: p, lastMaintenance: l, nextMaintenance: n, ...cleanData } = rest;
        if (!id || isNaN(id))
            return null;
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
    async remove(id) {
        if (!id || isNaN(id))
            return null;
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
};
exports.AssetsService = AssetsService;
exports.AssetsService = AssetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AssetsService);
//# sourceMappingURL=assets.service.js.map